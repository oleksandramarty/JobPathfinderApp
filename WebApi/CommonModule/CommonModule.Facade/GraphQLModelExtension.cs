using AuditTrail.Mediatr.Mediatr.Requests;
using AuthGateway.Mediatr.Mediatr.Auth.Requests;
using CommonModule.Core.Exceptions.Errors;
using CommonModule.Shared.Enums;
using CommonModule.Shared.Requests.Base;
using CommonModule.Shared.Responses.AuthGateway;
using CommonModule.Shared.Responses.AuthGateway.Users;
using CommonModule.Shared.Responses.Base;
using CommonModule.Shared.Responses.Dictionaries;
using CommonModule.Shared.Responses.Dictionaries.Models.Countries;
using CommonModule.Shared.Responses.Dictionaries.Models.Skills;
using CommonModule.Shared.Responses.Localizations;
using CommonModule.Shared.Responses.Localizations.Models.Locales;
using Dictionaries.Mediatr.Mediatr.Requests;
using Localizations.Mediatr.Mediatr.Localizations.Requests;
using NSwag.Generation.AspNetCore;

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
            
            config.DocumentProcessors.Add(new AddAdditionalClassTypeProcessor<LocalesRequest>());
            config.DocumentProcessors.Add(new AddAdditionalClassTypeProcessor<LocalizationsRequest>());
            
            config.DocumentProcessors.Add(new AddAdditionalClassTypeProcessor<CountriesRequest>());
            config.DocumentProcessors.Add(new AddAdditionalClassTypeProcessor<SkillsRequest>());
            config.DocumentProcessors.Add(new AddAdditionalClassTypeProcessor<SiteSettingsRequest>());
            
            config.DocumentProcessors.Add(new AddAdditionalClassTypeProcessor<FilteredAuditTrailRequest>());
            
            config.DocumentProcessors.Add(new AddAdditionalClassTypeProcessor<BaseFilterRequest>());
            
            config.DocumentProcessors.Add(new AddAdditionalClassTypeProcessor<SiteSettingsResponse>());
            config.DocumentProcessors.Add(new AddAdditionalClassTypeProcessor<JwtTokenResponse>());
            config.DocumentProcessors.Add(new AddAdditionalClassTypeProcessor<UserResponse>());
            config.DocumentProcessors.Add(new AddAdditionalClassTypeProcessor<LocalizationsResponse>());
            config.DocumentProcessors.Add(new AddAdditionalClassTypeProcessor<VersionedListResponse<LocaleResponse>>());
            config.DocumentProcessors.Add(new AddAdditionalClassTypeProcessor<VersionedListResponse<CountryResponse>>());
            config.DocumentProcessors.Add(new AddAdditionalClassTypeProcessor<VersionedListResponse<SkillResponse>>());
            config.DocumentProcessors.Add(new AddAdditionalClassTypeProcessor<BaseBoolResponse>());
            config.DocumentProcessors.Add(new AddAdditionalClassTypeProcessor<BaseEntityIdResponse<Guid>>());
            config.DocumentProcessors.Add(new AddAdditionalClassTypeProcessor<BaseEntityIdResponse<int>>());
        }
    }
}