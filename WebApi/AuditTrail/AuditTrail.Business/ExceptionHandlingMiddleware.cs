using System.Net;
using System.Text;
using CommonModule.Core.Exceptions;
using CommonModule.Core.Exceptions.Errors;
using CommonModule.Shared.Constants;
using CommonModule.Shared.Enums.AuditTrail;
using Microsoft.AspNetCore.Http;

namespace AuditTrail.Business;

/// <summary>
/// Middleware for handling exceptions in the application.
/// </summary>
public class ExceptionHandlingMiddleware
{
    private readonly RequestDelegate _next;
    // private readonly IAuditTrailRepository _auditTrailRepository;
    private readonly IHttpContextAccessor _httpContextAccessor;
    
    public ExceptionHandlingMiddleware(
        RequestDelegate next,
        // IAuditTrailRepository auditTrailRepository,
        IHttpContextAccessor httpContextAccessor
    )
    {
        _next = next;
        // _auditTrailRepository = auditTrailRepository;
        _httpContextAccessor = httpContextAccessor;
    }

    /// <summary>
    /// Invokes the middleware to handle exceptions.
    /// </summary>
    /// <param name="context">The HTTP context.</param>
    /// <returns>A task that represents the completion of request processing.</returns>
    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (AuthException ex)
        {
            await CreateAuditTrailAsync(context, ExceptionEnum.AuthException, ex.Message);
            await HandleExceptionAsync(context, ex, (HttpStatusCode)ex.StatusCode);
        }
        catch (BusinessException ex)
        {
            await CreateAuditTrailAsync(context, ExceptionEnum.BusinessException, ex.Message);
            await HandleExceptionAsync(context, ex, (HttpStatusCode)ex.StatusCode);
        }
        catch (EntityNotFoundException ex)
        {
            await CreateAuditTrailAsync(context, ExceptionEnum.EntityNotFoundException, ex.Message);
            await HandleExceptionAsync(context, ex, HttpStatusCode.NotFound);
        }
        catch (ForbiddenException ex)
        {
            await CreateAuditTrailAsync(context, ExceptionEnum.ForbiddenException, ex.Message);
            await HandleExceptionAsync(context, ex, HttpStatusCode.Forbidden);
        }
        catch (VersionException ex)
        {
            await CreateAuditTrailAsync(context, ExceptionEnum.VersionException, ex.Message);
            await HandleExceptionAsync(context, ex, HttpStatusCode.NotFound);
        }
        catch (BaseException ex)
        {
            await CreateAuditTrailAsync(context, ExceptionEnum.BaseException, ex.Message);
            await HandleExceptionAsync(context, ex, (HttpStatusCode)ex.StatusCode);
        }
        catch (Exception ex)
        {
            StringBuilder messageSb = new StringBuilder();
            messageSb.AppendLine(ex.Message);
            if (ex.InnerException != null)
            {
                messageSb.AppendLine(ex.InnerException.Message);
            }
            if (ex.StackTrace != null)
            {
                messageSb.AppendLine(ex.StackTrace);
            }
            if (ex.InnerException is { StackTrace: not null })
            {
                messageSb.AppendLine(ex.InnerException.StackTrace);
            }
            
            // await CreateAuditTrailAsync(context, ExceptionEnum.Exception, messageSb.ToString());
            await HandleExceptionAsync(context, ex, HttpStatusCode.InternalServerError);
        }
    }

    /// <summary>
    /// Creates an audit trail for the exception.
    /// </summary>
    /// <param name="context">Request context</param>
    /// <param name="exception">Type of the exception</param>
    /// <param name="message">Message of the exception</param>
    private async Task CreateAuditTrailAsync(
        HttpContext context, ExceptionEnum exception, string message
    )
    {
        // var userIdStr = _httpContextAccessor.HttpContext?.User.FindFirst(AuthClaims.UserId)?.Value;
        // if (userIdStr == null || !Guid.TryParse(userIdStr, out var userId))
        // {
        //     userId = Guid.Empty;
        // }
        //
        // await _auditTrailRepository.AddExceptionLogAsync(
        //     userId,
        //     exception,
        //     message,
        //     await new StreamReader(context.Request.Body).ReadToEndAsync(),
        //     CancellationToken.None
        // );
    }

    /// <summary>
    /// Handles the exception and writes the response.
    /// </summary>
    /// <param name="context">The HTTP context.</param>
    /// <param name="exception">The exception to handle.</param>
    /// <param name="statusCode">The HTTP status code to return.</param>
    /// <returns>A task that represents the completion of response writing.</returns>
    private static Task HandleExceptionAsync(HttpContext context, Exception exception, HttpStatusCode statusCode)
    {
        context.Response.ContentType = "application/json";
        context.Response.StatusCode = (int)statusCode;

        var errorModel = new ErrorMessageModel(exception.Message, context.Response.StatusCode);
        var result = errorModel.ToJson();

        return context.Response.WriteAsync(result);
    }
}