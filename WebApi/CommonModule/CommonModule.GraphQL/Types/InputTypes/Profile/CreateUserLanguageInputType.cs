using GraphQL.Types;

namespace CommonModule.GraphQL.Types.InputTypes.Profile;

public class CreateUserLanguageInputType : InputObjectGraphType
{
    public CreateUserLanguageInputType()
    {
        Name = "CreateUserLanguageInputType";
        
        Field<NonNullGraphType<IntGraphType>>("languageId");
        Field<NonNullGraphType<IntGraphType>>("languageLevelId");
    }
}