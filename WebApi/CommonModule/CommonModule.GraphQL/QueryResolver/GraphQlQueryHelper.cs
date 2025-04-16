using AuthGateway.Mediatr.Mediatr.Auth.Requests;
using CommonModule.GraphQL.Types.InputTypes.AuthGateway;
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

        EntityById<
            GuidGraphType,
            UserResponseType,
            Guid,
            UserResponse,
            UserByIdRequest,
            UserResponse
        >(GraphQlEndpoints.UserInfo);
        
        ExecuteForEmptyCommand<BaseBoolResponseType, AuthSignOutRequest, BaseBoolResponse>(GraphQlEndpoints.SignOut);
    }
}