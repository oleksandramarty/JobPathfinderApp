using GraphQL.Types;
using CommonModule.Shared.Enums.Users;

namespace CommonModule.GraphQL.Types.InputTypes.Profile;

public class CreateUserProfileItemInputType : InputObjectGraphType
{
    public CreateUserProfileItemInputType()
    {
        Name = "CreateUserProfileItemInputType";

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