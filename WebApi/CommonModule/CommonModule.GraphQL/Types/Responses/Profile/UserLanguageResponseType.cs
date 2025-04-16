using CommonModule.GraphQL.Types.EnumType;
using CommonModule.Shared.Responses.Profile.Profile;
using GraphQL.Types;

namespace CommonModule.GraphQL.Types.Responses.Profile;


public sealed class UserLanguageResponseType : ObjectGraphType<UserLanguageResponse>
{
    public UserLanguageResponseType()
    {
        Field(x => x.Id);
        Field(x => x.UserId);
        Field(x => x.LanguageId);
        Field(x => x.LanguageLevelId);
        Field<ListGraphType<UserProfileItemLanguageResponseType>>(nameof(UserLanguageResponse.UserProfileItems));
        Field(x => x.Status, type: typeof(StatusEnumType));
        Field(x => x.Version);
        Field(x => x.CreatedAt);
        Field(x => x.UpdatedAt, nullable: true);
    }
}