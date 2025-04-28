using System.Reflection;
using AuditTrail.Mediatr;
using AuthGateway.Mediatr;
using Autofac;
using Autofac.Core;
using CommonModule.Core.Mediatr;
using Dictionaries.Mediatr;
using FluentAssertions;
using Localizations.Mediatr;
using MediatR;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Profile.Mediatr;
using Profile.Mediatr.Mediatr.Profile.Handlers;
using AuthGateway.Mediatr.Mediatr.Auth.Handlers;
using AuditTrail.Mediatr.Mediatr.Handlers;
using Dictionaries.Mediatr.Mediatr.Handlers;

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

        string[] ignoreHandlerArray = new[]
        {
            // TODO implement and remove
            CleanGenericName(nameof(AuthForgotRequestHandler)),
            CleanGenericName(nameof(AuthRestoreCommandHandler)),
            CleanGenericName(nameof(AuthRestorePasswordCommandHandler)),
            
            // TODO implement and remove
            CleanGenericName(nameof(SiteSettingsRequestHandler)),
            CleanGenericName(nameof(SkillsRequestHandler)),
            CleanGenericName(nameof(CountriesRequestHandler)),
            
            CleanGenericName(nameof(FilteredAuditTrailRequestHandler)),
            CleanGenericName(typeof(MediatrBaseFilteredRequestHandler<,>).Name),
            CleanGenericName(typeof(CreateProfileGenericItemHandler<,>).Name),
            CleanGenericName(typeof(UpdateProfileGenericItemHandler<,>).Name),
            CleanGenericName(typeof(DeleteProfileGenericItemHandler<,>).Name),
            CleanGenericName(typeof(UserProfileGenericItemHandler<,,>).Name),
            CleanGenericName(typeof(MediatrDictionaryBase<,,,,>).Name),
        };

        // Assert that each handler has a corresponding integration test
        List<string> missingHandlers = new List<string>();
        foreach (var handlerType in handlerTypes)
        {
            if (ignoreHandlerArray.Contains(CleanGenericName(handlerType.Name)))
            {
                continue;
            }
            
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

    private static Type? FindIntegrationTestType(Type handlerType)
    {
        // Assuming your integration tests follow the naming convention
        string[] microservicesArray =
        [
            "AuditTrail",
            "AuthGateway",
            "Dictionaries",
            "Localizations",
            "Profile"
        ];

        foreach (var microservice in microservicesArray)
        {
            var integrationTestTypeName = $"{handlerType.Namespace}.{CleanGenericName(handlerType.Name)}Test".Replace($"{microservice}.Mediatr", "JobPathfinder.IntegrationTests").Replace(".Handlers", "");
            var integrationTestType = Assembly.GetExecutingAssembly().GetType(integrationTestTypeName);

            if (integrationTestType != null)
            {
                return integrationTestType;
            }
        }

        return null;
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
    
    private static string CleanGenericName(string name)
    {
        var backtickIndex = name.IndexOf('`');
        return backtickIndex > 0 ? name.Substring(0, backtickIndex) : name;
    }
}