using GraphQL.Types;

namespace CommonModule.GraphQL.Types.InputTypes.Profile;

public class CreateUserSkillInputType : InputObjectGraphType
{
    public CreateUserSkillInputType()
    {
        Name = "CreateUserSkillInputType";
        Field<NonNullGraphType<IntGraphType>>("skillId");
        Field<NonNullGraphType<IntGraphType>>("skillLevelId");
    }
}