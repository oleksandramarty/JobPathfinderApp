using CommonModule.Shared.Responses.Profile.Profile;
using GraphQL.Types;

namespace CommonModule.GraphQL.Types.Responses.Profile;

public sealed class UserProfileItemSkillResponseType : ObjectGraphType<UserProfileItemSkillResponse>
{
    public UserProfileItemSkillResponseType()
    {
        Field(x => x.Id);
        Field(x => x.UserSkillId);
        Field(x => x.UserProfileItemId);
    }
}