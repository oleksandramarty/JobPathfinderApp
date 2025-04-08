using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.SwaggerGen;

namespace CommonModule.Core.Filters;

public class CustomOperationIdFilter: IOperationFilter
{
    public void Apply(OpenApiOperation operation, OperationFilterContext context)
    {
        var controllerName = context.ApiDescription.ActionDescriptor.RouteValues["controller"];
        var actionName = context.ApiDescription.ActionDescriptor.RouteValues["action"];

        if (!string.IsNullOrEmpty(controllerName) && !string.IsNullOrEmpty(actionName) )
        {
            operation.OperationId = $"{char.ToLower(controllerName[0]) + controllerName.Substring(1)}_{actionName}";
        }
    }
}