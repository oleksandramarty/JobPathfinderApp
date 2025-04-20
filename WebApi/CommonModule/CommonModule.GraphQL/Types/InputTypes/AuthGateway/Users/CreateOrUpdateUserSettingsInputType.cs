using GraphQL.Types;

namespace CommonModule.GraphQL.Types.InputTypes.AuthGateway.Users;

public sealed class CreateOrUpdateUserSettingsInputType: InputObjectGraphType
{
    public CreateOrUpdateUserSettingsInputType()
    {
        Name = "CreateUserSettingCommandInputType";
        Field<StringGraphType>("login");
        Field<StringGraphType>("headline");
        Field<StringGraphType>("phone");
        Field<StringGraphType>("firstName");
        Field<StringGraphType>("lastName");
        Field<StringGraphType>("defaultLocale");
        Field<IntGraphType>("timeZone");
        Field<IntGraphType>("countryId");
        Field<IntGraphType>("currencyId");
        Field<NonNullGraphType<BooleanGraphType>>("applicationAiPrompt");
        Field<StringGraphType>("linkedInUrl");
        Field<StringGraphType>("npmUrl");
        Field<StringGraphType>("gitHubUrl");
        Field<StringGraphType>("portfolioUrl");
        Field<NonNullGraphType<BooleanGraphType>>("showCurrentPosition");
        Field<NonNullGraphType<BooleanGraphType>>("showHighestEducation");
    }
}