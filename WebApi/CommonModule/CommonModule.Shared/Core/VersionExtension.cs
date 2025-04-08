namespace CommonModule.Shared.Core;

public class VersionExtension
{
    public static string GenerateVersion()
    {
        return Guid.NewGuid().ToString("N").ToUpper();
    }
}