using GraphQL.Types;

namespace CommonModule.GraphQL.Types.InputTypes.AuthGateway.Users;

public sealed class CreateOrUpdateUserSettingsInputType: InputObjectGraphType
{
    public CreateOrUpdateUserSettingsInputType()
    {
        Name = "CreateUserSettingCommandInputType";
        Field<NonNullGraphType<StringGraphType>>("defaultLocale");
        Field<NonNullGraphType<IntGraphType>>("timeZone");
        Field<NonNullGraphType<IntGraphType>>("countryId");
        Field<NonNullGraphType<IntGraphType>>("defaultUserProjectCurrencyId");
        Field<NonNullGraphType<IdGraphType>>("defaultUserProjectId");
    }
}