using GraphQL.Types;

namespace CommonModule.GraphQL.Types.InputTypes.Profile;

public class UpdateUserLanguageInputType : InputObjectGraphType
{
    public UpdateUserLanguageInputType()
    {
        Name = "UpdateUserLanguageInputType";
        Field<NonNullGraphType<IntGraphType>>("languageId");
        Field<NonNullGraphType<IntGraphType>>("languageLevelId");
    }
}