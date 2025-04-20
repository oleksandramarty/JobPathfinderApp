using AuthGateway.Mediatr.Mediatr.Auth.Commands;
using CommonModule.GraphQL.Types.InputTypes.AuthGateway;
using CommonModule.GraphQL.Types.InputTypes.AuthGateway.Users;
using CommonModule.GraphQL.Types.InputTypes.Profile;
using CommonModule.GraphQL.Types.Responses.Base;
using CommonModule.Shared.Responses.Base;
using GraphQL.Types;
using Profile.Mediatr.Mediatr.Profile.Commands;

namespace CommonModule.GraphQL.MutationResolver;

public class GraphQlMutationHelper: GraphQlMutationResolver
{
    public void AddMonolithMutations()
    {
        AddAuthGatewayMutations();
        AddAuditTrailMutations();
        AddProfileMutations();
    }
    
    public void AddAuditTrailMutations()
    {
    }
    
    public void AddProfileMutations()
    {
        CreateEntity<CreateUserSkillInputType, BaseEntityIdOfGuidResponseType, CreateUserSkillCommand, BaseEntityIdResponse<Guid>>(GraphQlEndpoints.ProfileCreateUserSkill);
        UpdateEntity<UpdateUserSkillInputType, GuidGraphType, Guid, UpdateUserSkillCommand, BaseBoolResponse>(GraphQlEndpoints.ProfileUpdateUserSkill);
        DeleteEntity<DeleteUserSkillCommand, GuidGraphType, Guid>(GraphQlEndpoints.ProfileDeleteUserSkill);
        
        CreateEntity<CreateUserLanguageInputType, BaseEntityIdOfGuidResponseType, CreateUserLanguageCommand, BaseEntityIdResponse<Guid>>(GraphQlEndpoints.ProfileCreateUserLanguage);
        UpdateEntity<UpdateUserLanguageInputType, GuidGraphType, Guid, UpdateUserLanguageCommand, BaseBoolResponse>(GraphQlEndpoints.ProfileUpdateUserLanguage);
        DeleteEntity<DeleteUserLanguageCommand, GuidGraphType, Guid>(GraphQlEndpoints.ProfileDeleteUserLanguage);   
        
        CreateEntity<CreateUserProfileItemInputType, BaseEntityIdOfGuidResponseType, CreateUserProfileItemCommand, BaseEntityIdResponse<Guid>>(GraphQlEndpoints.ProfileCreateUserProfileItem);
        UpdateEntity<UpdateUserProfileItemInputType, GuidGraphType, Guid, UpdateUserProfileItemCommand, BaseBoolResponse>(GraphQlEndpoints.ProfileUpdateUserProfileItem);
        DeleteEntity<DeleteUserProfileItemCommand, GuidGraphType, Guid>(GraphQlEndpoints.ProfileDeleteUserProfileItem);   
    }

    public void AddAuthGatewayMutations()
    {
        CreateEntity<AuthSignUpInputType, BaseEntityIdOfGuidResponseType, AuthSignUpCommand, BaseEntityIdResponse<Guid>>(GraphQlEndpoints.SignUp);
        
        CreateEntity<CreateOrUpdateUserSettingsInputType, BaseBoolResponseType, UpdateUserPreferencesCommand, BaseBoolResponse>(GraphQlEndpoints.UserUpdatePreference);
    }
}