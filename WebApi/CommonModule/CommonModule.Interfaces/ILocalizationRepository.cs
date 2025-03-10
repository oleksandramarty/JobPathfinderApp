using CommonModule.Shared.Common.BaseInterfaces;
using CommonModule.Shared.Responses.Localizations;

namespace CommonModule.Interfaces;

public interface ILocalizationRepository
{
    Task<LocalizationsResponse> LocalizationDataAllAsync(bool isPublic);
    Task ReinitializeLocalizationDataAsync(LocalizationsResponse values, bool isPublic);
    Task<string> LocalizationVersionAsync(bool isPublic);
    Task SetLocalizationVersionAsync(bool isPublic);
}