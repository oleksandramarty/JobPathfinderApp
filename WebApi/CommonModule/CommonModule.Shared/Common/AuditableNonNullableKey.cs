using CommonModule.Shared.Common.BaseInterfaces;

namespace CommonModule.Shared.Common;

public class AuditableNonNullableKey : IAuditableNonNullableKey
{
    private string _key = string.Empty;

    public string? Key
    {
        get
        {
            if (string.IsNullOrEmpty(_key))
            {
                // TODO Audit Trail warning empty key
            }
            else
            {
                // TODO Audit Trail warning empty instance name
            }

            return _key;
        }
        set
        {
            if (string.IsNullOrEmpty(_key))
            {
                if (!string.IsNullOrEmpty(value))
                {
                    _key = value;
                }
                else
                {
                    // TODO Audit Trail warning empty key
                }
            }
        }
    }
}