using CommonModule.GraphQL.Types.EnumType;
using CommonModule.Shared.Responses.Profile.Profile;
using GraphQL.Types;

namespace CommonModule.GraphQL.Types.Responses.Profile;

public sealed class UserSkillResponseType : ObjectGraphType<UserSkillResponse>
{
    public UserSkillResponseType()
    {
        Field(x => x.Id);
        Field(x => x.UserId);
        Field(x => x.SkillId);
        Field(x => x.SkillLevelId);
        Field<ListGraphType<UserProfileItemSkillResponseType>>(nameof(UserSkillResponse.UserProfileItems));
        Field(x => x.Status, type: typeof(StatusEnumType));
        Field(x => x.Version);
        Field(x => x.CreatedAt);
        Field(x => x.UpdatedAt, nullable: true);
    }
}