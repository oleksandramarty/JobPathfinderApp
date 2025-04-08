using CommonModule.Shared.Constants;
using Microsoft.AspNetCore.Mvc.ModelBinding;

namespace CommonModule.Core.Exceptions.Errors;

public class ErrorSerializationModel: ErrorMessageModel
{
    public ErrorSerializationModel(string message, int code, ModelStateDictionary modelState) : base(message, code)
    {
        Fields = new Dictionary<string, object>();

        if (modelState == null)
        {
            throw new ArgumentNullException(nameof(modelState));
        }

        if (modelState.IsValid)
        {
            return;
        }

        foreach (var keyModelStatePair in modelState)
        {
            var key = string.IsNullOrEmpty(keyModelStatePair.Key)
                ? keyModelStatePair.Key
                : char.ToLowerInvariant(keyModelStatePair.Key[0]) + keyModelStatePair.Key.Substring(1);

            if (!string.IsNullOrEmpty(keyModelStatePair.Key))
            {
                var parts = keyModelStatePair.Key.Split('.');

                key = string.Join(".",
                    parts.Select(part => char.ToLowerInvariant(part[0]) + part.Substring(1)).ToList());
            }
            else
            {
                key = keyModelStatePair.Key;
            }

            var errors = keyModelStatePair.Value.Errors;
            if (errors != null && errors.Count > 0)
            {
                var errorMessages = errors.Select(error =>
                {
                    return string.IsNullOrEmpty(error.ErrorMessage)
                        ? ErrorMessages.InternalServerError
                        : error.ErrorMessage;
                }).ToArray();

                Fields.Add(key, errorMessages);
            }
        }
    }

    public Dictionary<string, object> Fields { get; }
}