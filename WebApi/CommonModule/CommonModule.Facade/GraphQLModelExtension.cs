using AuditTrail.Mediatr.Mediatr.Requests;
using AuthGateway.Mediatr.Mediatr.Auth.Commands;
using AuthGateway.Mediatr.Mediatr.Auth.Requests;
using CommonModule.Core.Exceptions.Errors;
using CommonModule.Shared.Requests.Base;
using CommonModule.Shared.Responses.AuthGateway;
using CommonModule.Shared.Responses.AuthGateway.Users;
using CommonModule.Shared.Responses.Base;
using CommonModule.Shared.Responses.Dictionaries;
using CommonModule.Shared.Responses.Dictionaries.Models.Countries;
using CommonModule.Shared.Responses.Dictionaries.Models.Currencies;
using CommonModule.Shared.Responses.Dictionaries.Models.ExperienceLevels;
using CommonModule.Shared.Responses.Dictionaries.Models.JobSources;
using CommonModule.Shared.Responses.Dictionaries.Models.JobTypes;
using CommonModule.Shared.Responses.Dictionaries.Models.Languages;
using CommonModule.Shared.Responses.Dictionaries.Models.Skills;
using CommonModule.Shared.Responses.Dictionaries.Models.WorkArrangements;
using CommonModule.Shared.Responses.Localizations;
using CommonModule.Shared.Responses.Localizations.Models.Locales;
using CommonModule.Shared.Responses.Profile.Profile;
using Dictionaries.Mediatr.Mediatr.Requests;
using Localizations.Mediatr.Mediatr.Localizations.Requests;
using NSwag.Generation.AspNetCore;
using Profile.Mediatr.Mediatr.Profile.Commands;

namespace CommonModule.Facade;

public static class GraphQLModelExtension
{
    public static void AddGraphQLModels(this AspNetCoreOpenApiDocumentGeneratorSettings config, bool addAdditionalTypes = false)
    {
        if (addAdditionalTypes)
        {
            config.DocumentProcessors.Add(new AddAdditionalClassTypeProcessor<ErrorMessageModel>());
            
            config.DocumentProcessors.Add(new AddAdditionalClassTypeProcessor<AuthSignInRequest>());
            config.DocumentProcessors.Add(new AddAdditionalClassTypeProcessor<AuthSignOutRequest>());
            config.DocumentProcessors.Add(new AddAdditionalClassTypeProcessor<CurrentUserRequest>());
            config.DocumentProcessors.Add(new AddAdditionalClassTypeProcessor<AuthForgotRequest>());
            config.DocumentProcessors.Add(new AddAdditionalClassTypeProcessor<UpdateUserPreferencesCommand>());
            
            config.DocumentProcessors.Add(new AddAdditionalClassTypeProcessor<LocalesRequest>());
            config.DocumentProcessors.Add(new AddAdditionalClassTypeProcessor<LocalizationsRequest>());
            
            config.DocumentProcessors.Add(new AddAdditionalClassTypeProcessor<CountriesRequest>());
            config.DocumentProcessors.Add(new AddAdditionalClassTypeProcessor<SkillsRequest>());
            config.DocumentProcessors.Add(new AddAdditionalClassTypeProcessor<SiteSettingsRequest>());
            
            config.DocumentProcessors.Add(new AddAdditionalClassTypeProcessor<FilteredAuditTrailRequest>());
            
            config.DocumentProcessors.Add(new AddAdditionalClassTypeProcessor<BaseFilterRequest>());
            
            config.DocumentProcessors.Add(new AddAdditionalClassTypeProcessor<AddUserSkillCommand>());
            config.DocumentProcessors.Add(new AddAdditionalClassTypeProcessor<AddUserLanguageCommand>());
            config.DocumentProcessors.Add(new AddAdditionalClassTypeProcessor<AddUserProfileItemCommand>());
            config.DocumentProcessors.Add(new AddAdditionalClassTypeProcessor<UpdateUserSkillCommand>());
            config.DocumentProcessors.Add(new AddAdditionalClassTypeProcessor<UpdateUserLanguageCommand>());
            config.DocumentProcessors.Add(new AddAdditionalClassTypeProcessor<UpdateUserProfileItemCommand>());
            
            config.DocumentProcessors.Add(new AddAdditionalClassTypeProcessor<SiteSettingsResponse>());
            config.DocumentProcessors.Add(new AddAdditionalClassTypeProcessor<JwtTokenResponse>());
            config.DocumentProcessors.Add(new AddAdditionalClassTypeProcessor<UserResponse>());
            config.DocumentProcessors.Add(new AddAdditionalClassTypeProcessor<LocalizationsResponse>());
            config.DocumentProcessors.Add(new AddAdditionalClassTypeProcessor<VersionedListResponse<LocaleResponse>>());
            config.DocumentProcessors.Add(new AddAdditionalClassTypeProcessor<VersionedListResponse<CountryResponse>>());
            config.DocumentProcessors.Add(new AddAdditionalClassTypeProcessor<VersionedListResponse<SkillResponse>>());
            
            config.DocumentProcessors.Add(new AddAdditionalClassTypeProcessor<UserLanguageResponse>());
            config.DocumentProcessors.Add(new AddAdditionalClassTypeProcessor<UserSkillResponse>());
            config.DocumentProcessors.Add(new AddAdditionalClassTypeProcessor<UserProfileItemResponse>());
            config.DocumentProcessors.Add(new AddAdditionalClassTypeProcessor<UserProfileResponse>());
            
            config.DocumentProcessors.Add(new AddAdditionalClassTypeProcessor<VersionedListResponse<CurrencyResponse>>());
            config.DocumentProcessors.Add(new AddAdditionalClassTypeProcessor<VersionedListResponse<ExperienceLevelResponse>>());
            config.DocumentProcessors.Add(new AddAdditionalClassTypeProcessor<VersionedListResponse<JobSourceResponse>>());
            config.DocumentProcessors.Add(new AddAdditionalClassTypeProcessor<VersionedListResponse<JobTypeResponse>>());
            config.DocumentProcessors.Add(new AddAdditionalClassTypeProcessor<VersionedListResponse<LanguageResponse>>());
            config.DocumentProcessors.Add(new AddAdditionalClassTypeProcessor<VersionedListResponse<LanguageLevelResponse>>());
            config.DocumentProcessors.Add(new AddAdditionalClassTypeProcessor<VersionedListResponse<SkillLevelResponse>>());
            config.DocumentProcessors.Add(new AddAdditionalClassTypeProcessor<VersionedListResponse<WorkArrangementResponse>>());
            
            config.DocumentProcessors.Add(new AddAdditionalClassTypeProcessor<BaseBoolResponse>());
            config.DocumentProcessors.Add(new AddAdditionalClassTypeProcessor<BaseEntityIdResponse<Guid>>());
            config.DocumentProcessors.Add(new AddAdditionalClassTypeProcessor<BaseEntityIdResponse<int>>());
        }
    }
}