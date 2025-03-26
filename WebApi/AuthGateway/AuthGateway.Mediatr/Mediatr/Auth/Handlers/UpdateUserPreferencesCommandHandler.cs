using AuthGateway.Domain;
using AuthGateway.Domain.Models.Users;
using AuthGateway.Mediatr.Mediatr.Auth.Commands;
using AutoMapper;
using CommonModule.Core.Exceptions;
using CommonModule.Core.Extensions;
using CommonModule.Interfaces;
using CommonModule.Shared.Constants;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace AuthGateway.Mediatr.Mediatr.Auth.Handlers;

public class UpdateUserPreferencesCommandHandler: IRequestHandler<UpdateUserPreferencesCommand>
{
    private readonly IMapper _mapper;
    private readonly IEntityValidator<AuthGatewayDataContext> _entityValidator;
    private readonly ICurrentUserRepository _currentUserRepository;
    private readonly IGenericRepository<Guid, UserEntity, AuthGatewayDataContext> _genericUserRepository;
    
    public UpdateUserPreferencesCommandHandler(
        IMapper mapper,
        IEntityValidator<AuthGatewayDataContext> entityValidator,
        ICurrentUserRepository currentUserRepository,
        IGenericRepository<Guid, UserEntity, AuthGatewayDataContext> genericUserRepository
        )
    {
        _mapper = mapper;
        _entityValidator = entityValidator;
        _currentUserRepository = currentUserRepository;
        _genericUserRepository = genericUserRepository;
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
    }

    private string? ProcessUrl(string? url, string? currentUrl)
    {
        return !string.IsNullOrEmpty(url) && 
               url.NotContainMaliciousContent() && 
               !url.Equals(currentUrl) ? 
                    UrlValidatorExtension.ValidateAndExtract(url) :
                    url;
    }
}