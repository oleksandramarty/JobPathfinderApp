using CommonModule.Shared.Responses.Base;
using MediatR;

namespace Profile.Mediatr.Mediatr.Profile.Commands;

public class CreateUserLanguageCommand: IRequest<BaseEntityIdResponse<Guid>>
{
    public int LanguageId { get; set; }
    public int LanguageLevelId { get; set; }
}