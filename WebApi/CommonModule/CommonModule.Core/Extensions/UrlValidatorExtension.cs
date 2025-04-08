using System.Text.RegularExpressions;
using CommonModule.Core.Exceptions;
using CommonModule.Shared.Constants;
using Microsoft.AspNetCore.Http;

namespace CommonModule.Core.Extensions;

public class UrlValidatorExtension
{
    // Platforms for extracting usernames
    private static readonly Dictionary<string, string> UsernamePatterns = new()
    {
        { "linkedin.com", @"linkedin\.com/in/([^/?#]+)" },  // LinkedIn: Extracts "/in/USERNAME"
        { "npmjs.com", @"npmjs\.com/~([^/?#]+)" },         // NPM: Extracts "/~USERNAME"
        { "github.com", @"github\.com/([^/?#]+)" }         // GitHub: Extracts "/USERNAME"
    };

    public static string? ValidateAndExtract(string? url)
    {
        if (string.IsNullOrWhiteSpace(url))
        {
            return string.Empty;
        }
        
        if (!Uri.TryCreate(url, UriKind.Absolute, out Uri? uri))
        {
            throw new BusinessException(ErrorMessages.InvalidUrl, StatusCodes.Status409Conflict);
        }

        if (uri.Scheme != Uri.UriSchemeHttps)
        {
            throw new BusinessException(ErrorMessages.InvalidHttpsUrl, StatusCodes.Status409Conflict);
        }

        string host = uri.Host.ToLower();

        // Check if we need to extract a username
        foreach (var platform in UsernamePatterns)
        {
            if (host.Contains(platform.Key))
            {
                Match match = Regex.Match(url, platform.Value, RegexOptions.IgnoreCase);
                if (match.Success)
                {
                    return match.Groups[1].Value;
                }
            }
        }
        
        throw new BusinessException(ErrorMessages.UnknownUrl, StatusCodes.Status409Conflict);
    }
}