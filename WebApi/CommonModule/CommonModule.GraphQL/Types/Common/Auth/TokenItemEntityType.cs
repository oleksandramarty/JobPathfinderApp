using CommonModule.Shared.Common.Auth;
using GraphQL.Types;

namespace CommonModule.GraphQL.Types.Common.Auth;

public sealed class TokenItemEntityType : ObjectGraphType<TokenItemEntity>
{
    public TokenItemEntityType()
    {
        Field(x => x.UserId);
        Field(x => x.Token);
        Field(x => x.Expiration);
    }
}