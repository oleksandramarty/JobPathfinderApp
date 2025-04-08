using System.Net;
using CommonModule.Shared.Constants;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ModelBinding;

namespace CommonModule.Core.Exceptions.Errors;

public class ErrorResultModel: ObjectResult
{
    public ErrorResultModel(int code, string message) : base(new ErrorMessageModel(message, code))
    {
        StatusCode = code;
    }

    public ErrorResultModel(int code, string message, ModelStateDictionary modelState)
        : base(new ErrorSerializationModel(message, code, modelState))
    {
        StatusCode = code;
    }

    public ErrorResultModel(ModelStateDictionary modelState)
        : base(new ErrorSerializationModel(ErrorMessages.InternalServerError, (int) HttpStatusCode.BadRequest,
            modelState))
    {
        StatusCode = 400;
    }
}