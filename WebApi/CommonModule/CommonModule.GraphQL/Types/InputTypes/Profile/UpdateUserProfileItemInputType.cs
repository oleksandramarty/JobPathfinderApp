using CommonModule.Shared.Enums.Users;
using GraphQL.Types;

namespace CommonModule.GraphQL.Types.InputTypes.Profile;

public class UpdateUserProfileItemInputType : InputObjectGraphType
{
    public UpdateUserProfileItemInputType()
    {
        Name = "UpdateUserProfileItemInputType";

        Field<NonNullGraphType<IntGraphType>>("profileItemType");
        Field<NonNullGraphType<DateGraphType>>("startDate");
        Field<DateGraphType>("endDate");
        Field<NonNullGraphType<StringGraphType>>("position");
        Field<StringGraphType>("description");
        Field<StringGraphType>("company");
        Field<StringGraphType>("location");
        Field<IntGraphType>("countryId");
        Field<IntGraphType>("jobTypeId");
        Field<IntGraphType>("workArrangementId");
    }
}