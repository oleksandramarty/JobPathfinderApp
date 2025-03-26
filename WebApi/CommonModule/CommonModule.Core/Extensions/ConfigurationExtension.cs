using Microsoft.Extensions.Configuration;

namespace CommonModule.Core.Extensions;

public static class ConfigurationExtension
{
    public static string GetMicroserviceVersion(this IConfiguration configuration)
    {
        string? version = configuration["Microservice:Version"];
        
        if (string.IsNullOrEmpty(version))
        {
            throw new ArgumentNullException(nameof(version), "Version cannot be null or empty.");
        }
        
        return version;
    }
    
    public static string GetSwaggerEndpointName(this IConfiguration configuration)
    {
        string? title = $"{configuration["Microservice:Title"]} {configuration.GetMicroserviceVersion()}";
        
        if (string.IsNullOrEmpty(title))
        {
            throw new ArgumentNullException(nameof(title), "Title cannot be null or empty.");
        }
        
        return title;
    }
}
