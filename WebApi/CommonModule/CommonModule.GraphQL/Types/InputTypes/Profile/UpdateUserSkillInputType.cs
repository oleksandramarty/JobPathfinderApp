using GraphQL.Types;

namespace CommonModule.GraphQL.Types.InputTypes.Profile;

public class UpdateUserSkillInputType : InputObjectGraphType
{
    public UpdateUserSkillInputType()
    {
        Name = "UpdateUserSkillInputType";
        Field<NonNullGraphType<IntGraphType>>("skillId");
        Field<NonNullGraphType<IntGraphType>>("skillLevelId");
    }
}