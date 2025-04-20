using AuthGateway.Mediatr.Mediatr.Auth.Commands;
using AuthGateway.Mediatr.Mediatr.Auth.Requests;
using CommonModule.GraphQL.Types.InputTypes.AuthGateway;
using CommonModule.GraphQL.Types.InputTypes.AuthGateway.Users;
using CommonModule.GraphQL.Types.InputTypes.Profile;
using CommonModule.GraphQL.Types.Responses.AuthGateway;
using CommonModule.GraphQL.Types.Responses.AuthGateway.Users;
using CommonModule.GraphQL.Types.Responses.Base;
using CommonModule.GraphQL.Types.Responses.Dictionaries;
using CommonModule.GraphQL.Types.Responses.Profile;
using CommonModule.Shared.Responses.AuthGateway;
using CommonModule.Shared.Responses.AuthGateway.Users;
using CommonModule.Shared.Responses.Base;
using CommonModule.Shared.Responses.Dictionaries;
using CommonModule.Shared.Responses.Profile.Profile;
using Dictionaries.Mediatr.Mediatr.Requests;
using GraphQL.Types;
using Profile.Mediatr.Mediatr.Profile.Requests;

namespace CommonModule.GraphQL.QueryResolver;

public class GraphQlQueryHelper: GraphQlQueryResolver
{
    public void AddMonolithQueries()
    {
        AddDictionariesQueries();
        AddAuthGatewayQueries();
        AddProfileQueries();
    }

    public void AddProfileQueries()
    {
        ResultForEmptyCommand<
            UserProfileResponseType,
            UserProfileResponse,
            UserProfileRequest,
            UserProfileResponse
        >(GraphQlEndpoints.ProfileCurrentUserProfile);
        
        EntityById<
            GuidGraphType,
            UserProfileResponseType,
            Guid,
            UserProfileResponse,
            UserProfileByIdRequest,
            UserProfileResponse
        >(GraphQlEndpoints.ProfileUserProfileById);
        
        EntityById<GuidGraphType, UserSkillResponseType, Guid, UserSkillResponse, UserSkillByIdRequest, UserSkillResponse>(GraphQlEndpoints.ProfileUserSkillById);
        EntityById<GuidGraphType, UserLanguageResponseType, Guid, UserLanguageResponse, UserLanguageByIdRequest, UserLanguageResponse>(GraphQlEndpoints.ProfileUserLanguageById);
        EntityById<GuidGraphType, UserProfileItemResponseType, Guid, UserProfileItemResponse, UserProfileItemByIdRequest, UserProfileItemResponse>(GraphQlEndpoints.ProfileUserProfileItemById);
    }

    public void AddDictionariesQueries()
    {
        ResultForEmptyCommand<
            SiteSettingsResponseType,
            SiteSettingsResponse,
            SiteSettingsRequest,
            SiteSettingsResponse
        >(GraphQlEndpoints.SiteSettings);
    }

    public void AddAuthGatewayQueries()
    {
        ResultForEmptyCommand<
            UserResponseType,
            UserResponse,
            CurrentUserRequest,
            UserResponse
        >(GraphQlEndpoints.CurrentUser);

        ResultForNonEmptyCommand<
            AuthSignInRequestInputType,
            JwtTokenResponseType,
            JwtTokenResponse,
            AuthSignInRequest,
            JwtTokenResponse
        >(GraphQlEndpoints.SignIn);
        
        ResultForNonEmptyCommand<
            AuthSignUpInputType,
            BaseEntityIdOfGuidResponseType,
            BaseEntityIdResponse<Guid>,
            AuthSignUpCommand,
            BaseEntityIdResponse<Guid>
        >(GraphQlEndpoints.SignUp);

        EntityById<
            GuidGraphType,
            UserResponseType,
            Guid,
            UserResponse,
            UserByIdRequest,
            UserResponse
        >(GraphQlEndpoints.UserInfo);
        
        ResultForNonEmptyCommand<
            UserLoginInputType,
            UserResponseType,
            UserResponse,
            UserByLoginRequest,
            UserResponse
        >(GraphQlEndpoints.UserInfoByLogin);
        
        ExecuteForEmptyCommand<BaseBoolResponseType, AuthSignOutRequest, BaseBoolResponse>(GraphQlEndpoints.SignOut);
    }
}