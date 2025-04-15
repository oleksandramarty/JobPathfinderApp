using AuthGateway.Mediatr.Mediatr.Auth.Commands;
using CommonModule.GraphQL.Types.InputTypes.AuthGateway;
using CommonModule.GraphQL.Types.Responses.Base;
using CommonModule.Shared.Responses.Base;

namespace CommonModule.GraphQL.MutationResolver;

public class GraphQlMutationHelper: GraphQlMutationResolver
{
    public void AddMonolithMutations()
    {
        AddAuthGatewayMutations();
        AddAuditTrailMutations();
    }
    public void AddAuditTrailMutations()
    {
    }

    public void AddAuthGatewayMutations()
    {
        CreateEntity<AuthSignUpInputType, BaseEntityIdOfGuidResponseType, AuthSignUpCommand, BaseEntityIdResponse<Guid>>(GraphQlEndpoints.SignUp);
    }
}