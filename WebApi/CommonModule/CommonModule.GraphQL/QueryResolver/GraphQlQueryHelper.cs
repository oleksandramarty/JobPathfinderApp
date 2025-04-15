using AuthGateway.Mediatr.Mediatr.Auth.Requests;
using CommonModule.GraphQL.Types.InputTypes.AuthGateway;
using CommonModule.GraphQL.Types.Responses.AuthGateway;
using CommonModule.GraphQL.Types.Responses.AuthGateway.Users;
using CommonModule.GraphQL.Types.Responses.Base;
using CommonModule.GraphQL.Types.Responses.Dictionaries;
using CommonModule.Shared.Responses.AuthGateway;
using CommonModule.Shared.Responses.AuthGateway.Users;
using CommonModule.Shared.Responses.Base;
using CommonModule.Shared.Responses.Dictionaries;
using Dictionaries.Mediatr.Mediatr.Requests;

namespace CommonModule.GraphQL.QueryResolver;

public class GraphQlQueryHelper: GraphQlQueryResolver
{
    public void AddMonolithQueries()
    {
        AddDictionariesQueries();
        AddAuthGatewayQueries();
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
        
        ExecuteForEmptyCommand<BaseBoolResponseType, AuthSignOutRequest, BaseBoolResponse>(GraphQlEndpoints.SignOut);
    }
}