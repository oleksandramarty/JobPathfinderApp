using CommonModule.GraphQL.Types.EnumType;
using CommonModule.Shared.Enums;
using CommonModule.Shared.Responses.AuthGateway.Users;
using GraphQL.Types;

namespace CommonModule.GraphQL.Types.Responses.AuthGateway.Users;

public sealed class UserResponseType : ObjectGraphType<UserResponse>
{
    public UserResponseType()
    {
        Field(x => x.Id);
        Field(x => x.Login, nullable: true);
        Field(x => x.FirstName, nullable: true);
        Field(x => x.LastName, nullable: true);
        Field(x => x.Headline, nullable: true);
        Field(x => x.Email, nullable: true);
        Field(x => x.Phone, nullable: true);
        Field(x => x.Status, type: typeof(StatusEnumType));
        Field(x => x.IsTemporaryPassword);
        Field(x => x.AuthType, type: typeof(EnumerationGraphType<UserAuthMethodEnum>));
        Field(x => x.LastForgotPassword, nullable: true);
        Field(x => x.LastForgotPasswordRequest, nullable: true);
        Field<ListGraphType<RoleResponseType>>(nameof(UserResponse.Roles));
        Field(x => x.UserSetting, type: typeof(UserSettingResponseType));
        Field(x => x.CreatedAt);
        Field(x => x.UpdatedAt, nullable: true);
        Field(x => x.Version);
    }
}