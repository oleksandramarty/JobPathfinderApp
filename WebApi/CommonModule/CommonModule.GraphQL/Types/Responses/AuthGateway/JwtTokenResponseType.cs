using CommonModule.Shared.Responses.AuthGateway;
using GraphQL.Types;

namespace CommonModule.GraphQL.Types.Responses.AuthGateway;

public sealed class JwtTokenResponseType : ObjectGraphType<JwtTokenResponse>
{
    public JwtTokenResponseType()
    {
        Field(x => x.Token);
    }
}