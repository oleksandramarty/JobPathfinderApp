using CommonModule.Core.Exceptions.Errors;
using CommonModule.Shared.Constants;

namespace CommonModule.Core.Exceptions;

public class EntityNotFoundException: BaseException
{
    public EntityNotFoundException() : base(ErrorMessages.EntityNotFound, 404)
    {
    }
}