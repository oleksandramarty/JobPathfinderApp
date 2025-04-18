using CommonModule.Shared.Enums;
using CommonModule.Shared.Responses.AuthGateway.Users;
using GraphQL.Types;

namespace CommonModule.GraphQL.Types.Responses.AuthGateway.Users;

public sealed class RoleResponseType : ObjectGraphType<RoleResponse>
{
    public RoleResponseType()
    {
        Field(x => x.Id);
        Field(x => x.Title, nullable: true);
        Field<IntGraphType>(
            nameof(RoleResponse.UserRole),
            resolve: context => (int)context.Source.UserRole
        );
    }
}