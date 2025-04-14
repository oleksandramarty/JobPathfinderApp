using CommonModule.Shared.Responses.Base;
using MediatR;

namespace Profile.Mediatr.Mediatr.Profile.Commands;

public class AddUserLanguageCommand: IRequest<BaseBoolResponse>
{
    public int LanguageId { get; set; }
    public int LanguageLevelId { get; set; }
}