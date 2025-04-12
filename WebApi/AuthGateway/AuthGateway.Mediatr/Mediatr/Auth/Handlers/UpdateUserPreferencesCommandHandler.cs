using AuthGateway.Domain;
using AuthGateway.Domain.Models.Profile;
using AuthGateway.Domain.Models.Users;
using AuthGateway.Mediatr.Mediatr.Auth.Commands;
using AutoMapper;
using CommonModule.Core.Exceptions;
using CommonModule.Core.Extensions;
using CommonModule.Interfaces;
using CommonModule.Shared.Constants;
using CommonModule.Shared.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace AuthGateway.Mediatr.Mediatr.Auth.Handlers;

public class UpdateUserPreferencesCommandHandler: IRequestHandler<UpdateUserPreferencesCommand>
{
    private readonly IMapper _mapper;
    private readonly IEntityValidator<AuthGatewayDataContext> _entityValidator;
    private readonly ICurrentUserRepository _currentUserRepository;
    private readonly IGenericRepository<Guid, UserEntity, AuthGatewayDataContext> _genericUserRepository;
    private readonly IGenericRepository<Guid, UserSkillEntity, AuthGatewayDataContext> _genericUserSkillRepository;
    private readonly IGenericRepository<Guid, UserLanguageEntity, AuthGatewayDataContext> _genericUserLanguageRepository;
    private readonly IGenericRepository<Guid, UserProfileItemEntity, AuthGatewayDataContext> _genericUserProfileItemRepository;
    
    public UpdateUserPreferencesCommandHandler(
        IMapper mapper,
        IEntityValidator<AuthGatewayDataContext> entityValidator,
        ICurrentUserRepository currentUserRepository,
        IGenericRepository<Guid, UserEntity, AuthGatewayDataContext> genericUserRepository,
        IGenericRepository<Guid, UserSkillEntity, AuthGatewayDataContext> genericUserSkillRepository,
        IGenericRepository<Guid, UserLanguageEntity, AuthGatewayDataContext> genericUserLanguageRepository,
        IGenericRepository<Guid, UserProfileItemEntity, AuthGatewayDataContext> genericUserProfileItemRepository
        )
    {
        _mapper = mapper;
        _entityValidator = entityValidator;
        _currentUserRepository = currentUserRepository;
        _genericUserRepository = genericUserRepository;
        _genericUserSkillRepository = genericUserSkillRepository;
        _genericUserLanguageRepository = genericUserLanguageRepository;
        _genericUserProfileItemRepository = genericUserProfileItemRepository;
    }
    
    public async Task Handle(UpdateUserPreferencesCommand command, CancellationToken cancellationToken)
    {
        Guid? userId = await _currentUserRepository.CurrentUserIdAsync();
        if (!userId.HasValue)
        {
            throw new EntityNotFoundException();
        }
        
        UserEntity? user = await _genericUserRepository.ByIdAsync(userId.Value, cancellationToken, 
            user => 
                user.Include(u => u.UserSetting));
        
        if (user == null)
        {
            throw new EntityNotFoundException();
        }
        
        user.CheckInvalidStatus();
        
        await _entityValidator.ValidateExistParamAsync<UserEntity>(
            u => u.Login == command.Login && u.Id != userId.Value, 
            ErrorMessages.EntityWithLoginAlreadyExists, 
            cancellationToken);
        
        user.FirstName = command.FirstName;
        user.LastName = command.LastName;
        user.Login = command.Login;
        user.LoginNormalized = command.Login.ToUpper();
        user.Phone = command.Phone;
        user.Headline = command.Headline;

        command.LinkedInUrl = ProcessUrl(command.LinkedInUrl, user.UserSetting?.LinkedInUrl);
        command.NpmUrl = ProcessUrl(command.NpmUrl, user.UserSetting?.NpmUrl);
        command.GitHubUrl = ProcessUrl(command.GitHubUrl, user.UserSetting?.GitHubUrl);
        
        if (user.UserSetting == null)
        {
            user.UserSetting = new UserSettingEntity
            {
                DefaultLocale = command.DefaultLocale ?? "en",
                CountryId = command.CountryId,
                ApplicationAiPrompt = command.ApplicationAiPrompt,
                CurrencyId = command.CurrencyId,
                TimeZone = command.TimeZone,
                UserId = userId.Value,
                LinkedInUrl = command.LinkedInUrl,
                NpmUrl = command.NpmUrl,
                GitHubUrl = command.GitHubUrl,
            };
            
            await _genericUserRepository.UpdateAsync(
                user,
                cancellationToken
            );
            
            return;
        }

        UserSettingEntity? updatedUserSettingEntity = _mapper.Map(command, user.UserSetting);
        if (updatedUserSettingEntity == null)
        {
            throw new InvalidOperationException(ErrorMessages.UpdateOnlyOwnSettings);
        }
            
        await _genericUserRepository.UpdateAsync(
            user,
            cancellationToken
        );
        
        await ProcessSkills(userId.Value, command, cancellationToken);
        await ProcessLanguages(userId.Value, command, cancellationToken);
        await ProcessUserProfileItems(userId.Value, command, cancellationToken);
    }

    private string? ProcessUrl(string? url, string? currentUrl)
    {
        return !string.IsNullOrEmpty(url) && 
               url.NotContainMaliciousContent() && 
               !url.Equals(currentUrl) ? 
                    UrlValidatorExtension.ValidateAndExtract(url) :
                    url;
    }

    private async Task ProcessSkills(Guid userId, UpdateUserPreferencesCommand command, CancellationToken cancellationToken)
    {
        List<UserSkillEntity> userSkillsToRemove = await _genericUserSkillRepository.ListAsync(
            u => u.UserId == userId &&
                 command.SkillIdsToRemove.Contains(u.Id),
            cancellationToken
        );
        
        if (userSkillsToRemove.Any())
        {
            await _genericUserSkillRepository.DeleteRangeAsync(
                userSkillsToRemove,
                cancellationToken
            );
        }
        
        List<UserSkillEntity> skillToAdd = command.AddOrUpdateUserSkills
            .Where(s => !s.Id.HasValue)
            .Select(x => new UserSkillEntity
            {
                Id = Guid.NewGuid(),
                UserId = userId,
                SkillId = x.SkillId,
                SkillLevelId = x.SkillLevelId,
                Status = StatusEnum.Active
            }).ToList();

        if (skillToAdd.Any())
        {
            await _genericUserSkillRepository.AddRangeAsync(
                skillToAdd,
                cancellationToken
            );
        }

        List<Guid> existingSkillIds = command.AddOrUpdateUserSkills
            .Where(s => s.Id.HasValue)
            .Select(x => x.Id.Value)
            .ToList();
        
        List<UserSkillEntity> existingSkills = await _genericUserSkillRepository.ListAsync(
            u => u.UserId == userId &&
                 existingSkillIds.Contains(u.Id),
            cancellationToken
        );
        
        if (existingSkills.Any())
        {
            foreach (UserSkillEntity existingSkill in existingSkills)
            {
                AddOrUpdateUserSkillCommand? skillToUpdate = command.AddOrUpdateUserSkills
                    .FirstOrDefault(s => s.Id == existingSkill.Id);
                
                if (skillToUpdate != null)
                {
                    existingSkill.SkillLevelId = skillToUpdate.SkillLevelId;
                }
            }
            
            await _genericUserSkillRepository.UpdateRangeAsync(
                existingSkills,
                cancellationToken
            );
        }
    }
    
    private async Task ProcessLanguages(Guid userId, UpdateUserPreferencesCommand command, CancellationToken cancellationToken)
    {
        List<UserLanguageEntity> userLanguagesToRemove = await _genericUserLanguageRepository.ListAsync(
            u => u.UserId == userId &&
                 command.LanguageIdsToRemove.Contains(u.Id),
            cancellationToken
        );
        
        if (userLanguagesToRemove.Any())
        {
            await _genericUserLanguageRepository.DeleteRangeAsync(
                userLanguagesToRemove,
                cancellationToken
            );
        }
        
        List<UserLanguageEntity> languagesToAdd = command.AddOrUpdateUserLanguages
            .Where(s => !s.Id.HasValue)
            .Select(x => new UserLanguageEntity
            {
                Id = Guid.NewGuid(),
                UserId = userId,
                LanguageId = x.LanguageId,
                LanguageLevelId = x.LanguageLevelId,
                Status = StatusEnum.Active
            }).ToList();

        if (languagesToAdd.Any())
        {
            await _genericUserLanguageRepository.AddRangeAsync(
                languagesToAdd,
                cancellationToken
            );
        }

        List<Guid> existingLanguageIds = command.AddOrUpdateUserLanguages
            .Where(s => s.Id.HasValue)
            .Select(x => x.Id.Value)
            .ToList();
        
        List<UserLanguageEntity> existingLanguages = await _genericUserLanguageRepository.ListAsync(
            u => u.UserId == userId &&
                 existingLanguageIds.Contains(u.Id),
            cancellationToken
        );
        
        if (existingLanguages.Any())
        {
            foreach (UserLanguageEntity existingLanguage in existingLanguages)
            {
                AddOrUpdateUserLanguageCommand? languageToUpdate = command.AddOrUpdateUserLanguages
                    .FirstOrDefault(s => s.Id == existingLanguage.Id);
                
                if (languageToUpdate != null)
                {
                    existingLanguage.LanguageLevelId = languageToUpdate.LanguageLevelId;
                }
            }
            
            await _genericUserLanguageRepository.UpdateRangeAsync(
                existingLanguages,
                cancellationToken
            );
        }
    }
    
    private async Task ProcessUserProfileItems(Guid userId, UpdateUserPreferencesCommand command, CancellationToken cancellationToken)
    {
        List<UserProfileItemEntity> userProfileItemsToRemove = await _genericUserProfileItemRepository.ListAsync(
            u => u.UserId == userId &&
                 command.ProfileItemIdsToRemove.Contains(u.Id),
            cancellationToken
        );
        
        if (userProfileItemsToRemove.Any())
        {
            await _genericUserProfileItemRepository.DeleteRangeAsync(
                userProfileItemsToRemove,
                cancellationToken
            );
        }
        
        List<UserProfileItemEntity> profileItemsToAdd = command.AddOrUpdateProfileItems
            .Where(s => !s.Id.HasValue)
            .Select(x => new UserProfileItemEntity
            {
                Id = Guid.NewGuid(),
                UserId = userId,
                ProfileItemType = x.ProfileItemType,
                Position = x.Position,
                Description = x.Description,
                Company = x.Company,
                Location = x.Location,
                StartDate = x.StartDate,
                EndDate = x.EndDate,
                CountryId = x.CountryId,
                JobTypeId = x.JobTypeId,
                WorkArrangementId = x.WorkArrangementId,
                Status = StatusEnum.Active,
                // TODO add skills and languages
                // Languages = x.LanguageIds?.Select(langId => new UserProfileItemLanguageEntity
                // {
                //     LanguageId = langId
                // }).ToList() ?? new List<UserProfileItemLanguageEntity>(),
                // Skills = x.SkillIds?.Select(skillId => new UserProfileItemSkillEntity
                // {
                //     SkillId = skillId
                // }).ToList() ?? new List<UserProfileItemSkillEntity>()
            }).ToList();

        if (profileItemsToAdd.Any())
        {
            await _genericUserProfileItemRepository.AddRangeAsync(
                profileItemsToAdd,
                cancellationToken
            );
        }

        List<Guid> existingProfileItemIds = command.AddOrUpdateProfileItems
            .Where(s => s.Id.HasValue)
            .Select(x => x.Id.Value)
            .ToList();
        
        List<UserProfileItemEntity> existingProfileItems = await _genericUserProfileItemRepository.ListAsync(
            u => u.UserId == userId &&
                 existingProfileItemIds.Contains(u.Id),
            cancellationToken
        );
        
        if (existingProfileItems.Any())
        {
            foreach (UserProfileItemEntity existingProfileItem in existingProfileItems)
            {
                AddOrUpdateUserProfileItemCommand? profileItemToUpdate = command.AddOrUpdateProfileItems
                    .FirstOrDefault(s => s.Id == existingProfileItem.Id);
                
                if (profileItemToUpdate != null)
                {
                    existingProfileItem.Position = profileItemToUpdate.Position;
                    existingProfileItem.Description = profileItemToUpdate.Description;
                    existingProfileItem.Company = profileItemToUpdate.Company;
                    existingProfileItem.Location = profileItemToUpdate.Location;
                    existingProfileItem.StartDate = profileItemToUpdate.StartDate;
                    existingProfileItem.EndDate = profileItemToUpdate.EndDate;
                    existingProfileItem.CountryId = profileItemToUpdate.CountryId;
                    existingProfileItem.JobTypeId = profileItemToUpdate.JobTypeId;
                    existingProfileItem.WorkArrangementId = profileItemToUpdate.WorkArrangementId;
                    
                    // if (profileItemToUpdate.LanguageIds != null)
                    // {
                    //     existingProfileItem.Languages = profileItemToUpdate.LanguageIds
                    //         .Select(langId => new UserProfileItemLanguageEntity
                    //         {
                    //             LanguageId = langId
                    //         }).ToList();
                    // }
                    //
                    // if (profileItemToUpdate.SkillIds != null)
                    // {
                    //     existingProfileItem.Skills = profileItemToUpdate.SkillIds
                    //         .Select(skillId => new UserProfileItemSkillEntity
                    //         {
                    //             SkillId = skillId
                    //         }).ToList();
                    // }
                }
            }
            
            await _genericUserProfileItemRepository.UpdateRangeAsync(
                existingProfileItems,
                cancellationToken
            );
        }
    }
}