using System.Reflection;
using AuditTrail.Mediatr;
using AuthGateway.Mediatr;
using Autofac;
using Autofac.Core;
using Dictionaries.Mediatr;
using FluentAssertions;
using Localizations.Mediatr;
using MediatR;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Profile.Mediatr;

namespace JobPathfinder.IntegrationTests;

[TestClass]
public class MediatorModuleTest
{
    [TestMethod]
    public void EnsureAllHandlersHaveIntegrationTests()
    {
        // Arrange
        var containerBuilder = new ContainerBuilder();
        containerBuilder.RegisterModule(new MediatrAuditTrailModule());
        containerBuilder.RegisterModule(new MediatrAuthModule());
        containerBuilder.RegisterModule(new MediatrDictionariesModule());
        containerBuilder.RegisterModule(new MediatorLocalizationsModule());
        containerBuilder.RegisterModule(new MediatrProfileModule());
        var container = containerBuilder.Build();

        // Get all handler types
        var handlerTypes = GetAllHandlerTypes(container);

        // Assert that each handler has a corresponding integration test
        List<string> missingHandlers = new List<string>();
        foreach (var handlerType in handlerTypes)
        {
            var integrationTestType = FindIntegrationTestType(handlerType);
            if (integrationTestType == null)
            {
                missingHandlers.Add(handlerType.Name);
            }
            // integrationTestType.Should().NotBeNull();
            //Assert.IsNotNull(integrationTestType, $"Integration test not found for handler: {handlerType.Name}");
        }

        var result = missingHandlers.Distinct().ToList();

        if (result.Any())
        {
            Console.Error.WriteLine("---------------------------------------");
            Console.Error.WriteLine($"The following handlers have not integration tests : Count : {result.Count}");
            Console.Error.WriteLine("---------------------------------------");
            Console.Error.WriteLine(String.Join("\n", result));
            Console.Error.WriteLine("---------------------------------------");
        }

#if DEBUG
        result.Any().Should().Be(false);
#endif
    }

    private static Type FindIntegrationTestType(Type handlerType)
    {
        // Assuming your integration tests follow the naming convention
        var integrationTestTypeName = $"{handlerType.Namespace}.{handlerType.Name}IntegrationTest".Replace("JobPathfinder.Mediator", "JobPathfinder.IntegrationTests").Replace(".Handlers", "");
        var integrationTestType = Assembly.GetExecutingAssembly().GetType(integrationTestTypeName);

        return integrationTestType;
    }

    private static IEnumerable<Type> GetAllHandlerTypes(IContainer container)
    {
        var handlerTypes = new List<Type>();

        // Get all registered types in the container
        var allTypes = container.ComponentRegistry.Registrations
            .SelectMany(registration => registration.Services)
            .OfType<IServiceWithType>()
            .Select(serviceWithType => serviceWithType.ServiceType);

        // Filter out types that implement IRequestHandler<,>
        foreach (var type in allTypes)
        {
            var implementedInterfaces = type.GetInterfaces();
            if (implementedInterfaces.Any(i => 
                    i.IsGenericType && 
                        (i.GetGenericTypeDefinition() == typeof(IRequestHandler<,>) || 
                         i.GetGenericTypeDefinition() == typeof(IRequestHandler<>)
                         )
                    )
                )
            {
                handlerTypes.Add(type);
            }
        }

        return handlerTypes;
    }
}