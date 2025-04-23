using Microsoft.AspNetCore.Http;

namespace JobPathfinder.IntegrationTests.Core;

/// <summary>
/// Utility class for testing MediatR commands
/// </summary>
public class HttpContextAccessorForTesting : IHttpContextAccessor
{
    public HttpContextAccessorForTesting()
    {
        HttpContext = new DefaultHttpContext();
    }
    public HttpContext? HttpContext { get; set; }
}