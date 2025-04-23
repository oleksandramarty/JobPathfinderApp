using Autofac;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.AspNetCore.TestHost;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Monolith.ClientApi;

namespace JobPathfinder.IntegrationTests.Core;

/// <summary>
/// Base class for integration tests
/// </summary>
public class IntegrationTestBase : WebApplicationFactory<Program>
{
    /// <summary>
    /// Options for integration tests
    /// </summary>
    private IntegrationTestOptions Options { get; }

    public IntegrationTestBase(IntegrationTestOptions options)
    {
        Options = options;
    }

    /// <summary>
    /// Create host for integration tests
    /// </summary>
    /// <param name="builder"></param>
    /// <returns></returns>
    protected override IHost CreateHost(IHostBuilder builder)
    {
        builder.ConfigureWebHost(webHostBuilder =>
        {
            webHostBuilder
                .UseEnvironment("IntegrationTests")
                .UseTestServer()
                .ConfigureTestServices(services =>
                {
                    services.AddSingleton<IHttpContextAccessor>(Options.GenerateClaims());
                })
                .ConfigureAppConfiguration(config => { })
                .ConfigureTestContainer<ContainerBuilder>(opt => { });
        });

        return base.CreateHost(builder);
    }
}