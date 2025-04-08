using System.Text;
using System.Text.RegularExpressions;

namespace CommonModule.Core.Extensions;

public static class StringExtension
{
    public static byte[] StringToUtf8Bytes(this string str)
    {
        if (str == null)
            throw new ArgumentNullException(nameof(str));

        // Calculate the maximum possible size for UTF-8 encoding
        int maxSize = str.Length * 4;
        byte[] bytes = new byte[maxSize];
        int index = 0;

        foreach (char c in str)
        {
            if (c <= 0x7F)
            {
                // 1-byte sequence
                bytes[index++] = (byte)c;
            }
            else if (c <= 0x7FF)
            {
                // 2-byte sequence
                bytes[index++] = (byte)(0xC0 | (c >> 6));
                bytes[index++] = (byte)(0x80 | (c & 0x3F));
            }
            else if (c <= 0xFFFF)
            {
                // 3-byte sequence
                bytes[index++] = (byte)(0xE0 | (c >> 12));
                bytes[index++] = (byte)(0x80 | ((c >> 6) & 0x3F));
                bytes[index++] = (byte)(0x80 | (c & 0x3F));
            }
            else
            {
                // 4-byte sequence
                bytes[index++] = (byte)(0xF0 | (c >> 18));
                bytes[index++] = (byte)(0x80 | ((c >> 12) & 0x3F));
                bytes[index++] = (byte)(0x80 | ((c >> 6) & 0x3F));
                bytes[index++] = (byte)(0x80 | (c & 0x3F));
            }
        }

        // Return the exact size of the byte array
        Array.Resize(ref bytes, index);
        return bytes;
    }

    public static bool BeAValidUrl(this string url)
    {
        return Uri.TryCreate(url, UriKind.Absolute, out _);
    }

    public static bool NotContainMaliciousContent(this string url)
    {
        // Check for common XSS patterns
        string pattern = @"<script|javascript:|data:|vbscript:|on\w+=";
        return !Regex.IsMatch(url, pattern, RegexOptions.IgnoreCase);
    }

    public static string InterleaveStrings(string str1, string str2)
    {
        int maxLength = Math.Max(str1.Length, str2.Length);
        var result = new StringBuilder();

        for (int i = 0; i < maxLength; i++)
        {
            if (i < str1.Length)
            {
                result.Append(str1[i]);
            }

            if (i < str2.Length)
            {
                result.Append(str2[i]);
            }
        }

        return result.ToString();
    }

    public static TTarget ConvertTo<TTarget>(this string source)
    {
        if (string.IsNullOrEmpty(source))
        {
            throw new ArgumentNullException(nameof(source));
        }

        if (typeof(TTarget) == typeof(Guid))
        {
            if (Guid.TryParse(source, out var result))
            {
                return (TTarget)(object)result;
            }
        }
        else if (typeof(TTarget) == typeof(int))
        {
            if (int.TryParse(source, out var result))
            {
                return (TTarget)(object)result;
            }
        }
        else if (typeof(TTarget) == typeof(long))
        {
            if (long.TryParse(source, out var result))
            {
                return (TTarget)(object)result;
            }
        }
        else if (typeof(TTarget) == typeof(string))
        {
            return (TTarget)(object)source;
        }
        else if (typeof(TTarget) == typeof(byte))
        {
            if (byte.TryParse(source, out var result))
            {
                return (TTarget)(object)result;
            }
        }
        else
        {
            try
            {
                return (TTarget)Convert.ChangeType(source, typeof(TTarget));
            }
            catch (Exception)
            {
                throw new InvalidOperationException($"Conversion to {typeof(TTarget).Name} failed.");
            }
        }

        throw new InvalidOperationException($"Conversion to {typeof(TTarget).Name} failed.");
    }

    public static string GenerateRandomString(int length, bool withSpecialCharacters = false)
    {
        const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        const string specialChars = "@$!%*?&";
        var random = new Random();
        var characterSet = withSpecialCharacters ? chars + specialChars : chars;
        return new string(Enumerable.Repeat(characterSet, length)
            .Select(s => s[random.Next(s.Length)]).ToArray());
    }
}