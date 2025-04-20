using CommonModule.Shared.Responses.Profile.Profile;
using GraphQL.Types;

namespace CommonModule.GraphQL.Types.Responses.Profile;

public sealed class UserProfileResponseType : ObjectGraphType<UserProfileResponse>
{
    public UserProfileResponseType()
    {
        Field<ListGraphType<UserSkillResponseType>>(nameof(UserProfileResponse.Skills));
        Field<ListGraphType<UserLanguageResponseType>>(nameof(UserProfileResponse.Languages));
        Field<ListGraphType<UserProfileItemResponseType>>(nameof(UserProfileResponse.Items));
    }
}