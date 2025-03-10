using CommonModule.Core.Exceptions;
using CommonModule.Shared.Common.BaseInterfaces;
using CommonModule.Shared.Constants;
using CommonModule.Shared.Enums;
using FluentValidation;

namespace CommonModule.Core.Extensions;

public static class ValidationExtensions
{
    public static IRuleBuilderOptions<T, string> CheckHarmfulContent<T>(this IRuleBuilder<T, string> ruleBuilder)
    {
        return ruleBuilder
            .Must(u => u.NotContainMaliciousContent()).WithMessage(ErrorMessages.PotentialHarmfulContent);
    }
    
    public static void CheckInvalidStatus<TEntity>(this TEntity entity)
    where TEntity : class, IStatusEntity
    {
        switch (entity.Status)
        {
            case StatusEnum.New:
                throw new BusinessException(ErrorMessages.StatusNew, 409);
            case StatusEnum.Inactive:
                throw new BusinessException(ErrorMessages.StatusInactive, 409);
            case StatusEnum.Blocked:
                throw new BusinessException(ErrorMessages.StatusBlocked, 409);
            case StatusEnum.Deleted:
                throw new BusinessException(ErrorMessages.StatusDeleted, 409);
            case StatusEnum.Rejected:
                throw new BusinessException(ErrorMessages.StatusRejected, 409);
            case StatusEnum.Archived:
                throw new BusinessException(ErrorMessages.StatusArchived, 409);
        }
    }
}