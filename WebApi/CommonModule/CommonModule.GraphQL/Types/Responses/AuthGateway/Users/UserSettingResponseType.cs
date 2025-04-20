using CommonModule.Shared.Responses.AuthGateway.Users;
using GraphQL.Types;

namespace CommonModule.GraphQL.Types.Responses.AuthGateway.Users;

public sealed class UserSettingResponseType : ObjectGraphType<UserSettingResponse>
{
    public UserSettingResponseType()
    {
        Field(x => x.Id);
        Field(x => x.DefaultLocale, nullable: true);
        Field(x => x.TimeZone);
        Field(x => x.CountryId, nullable: true);
        Field(x => x.CurrencyId, nullable: true);
        Field(x => x.ApplicationAiPrompt);
        Field(x => x.UserId);
        Field(x => x.LinkedInUrl, nullable: true);
        Field(x => x.NpmUrl, nullable: true);
        Field(x => x.GitHubUrl, nullable: true);
        Field(x => x.PortfolioUrl, nullable: true);
        Field(x => x.ShowCurrentPosition);
        Field(x => x.ShowHighestEducation);
        Field(x => x.Version);
    }
}