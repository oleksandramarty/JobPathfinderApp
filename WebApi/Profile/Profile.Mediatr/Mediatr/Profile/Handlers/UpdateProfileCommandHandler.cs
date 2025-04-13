using AutoMapper;
using CommonModule.Core.Exceptions;
using CommonModule.Interfaces;
using CommonModule.Shared.Constants;
using CommonModule.Shared.Enums;
using MediatR;
using Profile.Domain;
using Profile.Domain.Models.Profile;
using Profile.Mediatr.Mediatr.Profile.Commands;

namespace Profile.Mediatr.Mediatr.Profile.Handlers;

public class UpdateProfileCommandHandler: IRequestHandler<UpdateProfileCommand>
{
    private readonly IMapper _mapper;
    private readonly ICurrentUserRepository _currentUserRepository;
    private readonly IGenericRepository<Guid, UserSkillEntity, ProfileDataContext> _genericUserSkillRepository;
    private readonly IGenericRepository<Guid, UserLanguageEntity, ProfileDataContext> _genericUserLanguageRepository;
    private readonly IGenericRepository<Guid, UserProfileItemEntity, ProfileDataContext> _genericUserProfileItemRepository;
    
    public UpdateProfileCommandHandler(
        IMapper mapper,
        ICurrentUserRepository currentUserRepository,
        IGenericRepository<Guid, UserSkillEntity, ProfileDataContext> genericUserSkillRepository,
        IGenericRepository<Guid, UserLanguageEntity, ProfileDataContext> genericUserLanguageRepository,
        IGenericRepository<Guid, UserProfileItemEntity, ProfileDataContext> genericUserProfileItemRepository
        )
    {
        _mapper = mapper;
        _currentUserRepository = currentUserRepository;
        _genericUserSkillRepository = genericUserSkillRepository;
        _genericUserLanguageRepository = genericUserLanguageRepository;
        _genericUserProfileItemRepository = genericUserProfileItemRepository;
    }
    
    public async Task Handle(UpdateProfileCommand command, CancellationToken cancellationToken)
    {
        Guid? userId = await _currentUserRepository.CurrentUserIdAsync();
        if (!userId.HasValue)
        {
            throw new EntityNotFoundException();
        }
        
        await ProcessSkills(userId.Value, command, cancellationToken);
        await ProcessLanguages(userId.Value, command, cancellationToken);
        await ProcessUserProfileItems(userId.Value, command, cancellationToken);
    }
    
    private async Task ProcessSkills(Guid userId, UpdateProfileCommand command, CancellationToken cancellationToken)
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
        
        List<UserSkillEntity> skillToAdd = command.AddUserSkills
            .Select(x => new UserSkillEntity
            {
                Id = x.Id ?? Guid.NewGuid(),
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

        List<Guid> existingSkillIds = command.UpdateUserSkills
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
                AddOrUpdateUserSkillCommand? skillToUpdate = command.UpdateUserSkills
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
    
    private async Task ProcessLanguages(Guid userId, UpdateProfileCommand command, CancellationToken cancellationToken)
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
        
        List<UserLanguageEntity> languagesToAdd = command.AddUserLanguages
            .Select(x => new UserLanguageEntity
            {
                Id = x.Id ?? Guid.NewGuid(),
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

        List<Guid> existingLanguageIds = command.UpdateUserLanguages
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
                AddOrUpdateUserLanguageCommand? languageToUpdate = command.UpdateUserLanguages
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
    
    private async Task ProcessUserProfileItems(Guid userId, UpdateProfileCommand command, CancellationToken cancellationToken)
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
        
        List<UserProfileItemEntity> profileItemsToAdd = command.AddProfileItems
            .Select(x => new UserProfileItemEntity
            {
                Id = x.Id ?? Guid.NewGuid(),
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
                // Version = VersionExtension.GenerateVersion(),
                // Languages = x.LanguageIds?.Select(langId => new UserProfileItemLanguageEntity
                // {
                //     Id = Guid.NewGuid(),
                //     LanguageId = langId,
                //     Status = StatusEnum.Active
                // }).ToList() ?? new List<UserProfileItemLanguageEntity>(),
                // Skills = x.SkillIds?.Select(skillId => new UserProfileItemSkillEntity
                // {
                //     Id = Guid.NewGuid(),
                //     SkillId = skillId,
                //     Status = StatusEnum.Active
                // }).ToList() ?? new List<UserProfileItemSkillEntity>()
            }).ToList();

        if (profileItemsToAdd.Any())
        {
            await _genericUserProfileItemRepository.AddRangeAsync(
                profileItemsToAdd,
                cancellationToken
            );
        }

        List<Guid> existingProfileItemIds = command.UpdateProfileItems
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
                AddOrUpdateUserProfileItemCommand? profileItemToUpdate = command.UpdateProfileItems
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
                    // existingProfileItem.Version = VersionExtension.GenerateVersion();

                    // // Обновляем языки
                    // if (profileItemToUpdate.LanguageIds != null)
                    // {
                    //     // Удаляем старые языки
                    //     existingProfileItem.Languages.Clear();
                    //     
                    //     // Добавляем новые языки
                    //     existingProfileItem.Languages = profileItemToUpdate.LanguageIds
                    //         .Select(langId => new UserProfileItemLanguageEntity
                    //         {
                    //             Id = Guid.NewGuid(),
                    //             LanguageId = langId,
                    //             Status = StatusEnum.Active
                    //         }).ToList();
                    // }
                    //
                    // // Обновляем навыки
                    // if (profileItemToUpdate.SkillIds != null)
                    // {
                    //     // Удаляем старые навыки
                    //     existingProfileItem.Skills.Clear();
                    //     
                    //     // Добавляем новые навыки
                    //     existingProfileItem.Skills = profileItemToUpdate.SkillIds
                    //         .Select(skillId => new UserProfileItemSkillEntity
                    //         {
                    //             Id = Guid.NewGuid(),
                    //             SkillId = skillId,
                    //             Status = StatusEnum.Active
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