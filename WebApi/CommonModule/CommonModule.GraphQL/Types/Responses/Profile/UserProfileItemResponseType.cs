using CommonModule.GraphQL.Types.EnumType;
using CommonModule.Shared.Enums.Users;
using CommonModule.Shared.Responses.Profile.Profile;
using GraphQL.Types;

namespace CommonModule.GraphQL.Types.Responses.Profile;

public sealed class UserProfileItemResponseType : ObjectGraphType<UserProfileItemResponse>
{
    public UserProfileItemResponseType()
    {
        Field(x => x.Id);
        Field(x => x.UserId);
        Field<IntGraphType>(
            nameof(UserProfileItemResponse.ProfileItemType),
            resolve: context => (int)context.Source.ProfileItemType
        );
        Field(x => x.StartDate);
        Field(x => x.EndDate, nullable: true);
        Field(x => x.Position);
        Field(x => x.Description, nullable: true);
        Field(x => x.Company, nullable: true);
        Field(x => x.Location, nullable: true);
        Field(x => x.CountryId, nullable: true);
        Field(x => x.JobTypeId, nullable: true);
        Field(x => x.WorkArrangementId, nullable: true);
        Field<ListGraphType<UserProfileItemLanguageResponseType>>(nameof(UserProfileItemResponse.Languages));
        Field<ListGraphType<UserProfileItemSkillResponseType>>(nameof(UserProfileItemResponse.Skills));
        Field<IntGraphType>(
            nameof(UserProfileItemResponse.Status),
            resolve: context => (int)context.Source.Status
        );
        Field(x => x.Version);
        Field(x => x.CreatedAt);
        Field(x => x.UpdatedAt, nullable: true);
    }
}