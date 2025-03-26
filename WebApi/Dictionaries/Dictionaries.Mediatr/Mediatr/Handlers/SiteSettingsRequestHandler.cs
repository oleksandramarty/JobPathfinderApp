using CommonModule.Interfaces;
using CommonModule.Shared.Core;
using CommonModule.Shared.Responses.Dictionaries;
using Dictionaries.Mediatr.Mediatr.Requests;
using MediatR;

namespace Dictionaries.Mediatr.Mediatr.Handlers;

public class SiteSettingsRequestHandler: IRequestHandler<SiteSettingsRequest, SiteSettingsResponse>
{
    private readonly ICacheBaseRepository<Guid> _cacheBaseRepository;
    
    public SiteSettingsRequestHandler(ICacheBaseRepository<Guid> cacheBaseRepository)
    {
        _cacheBaseRepository = cacheBaseRepository;
    }
    
    public async Task<SiteSettingsResponse> Handle(SiteSettingsRequest request, CancellationToken cancellationToken)
    {
        SiteSettingsResponse response = new SiteSettingsResponse
        {
            Version = new CacheVersionResponse
            {
                Localization = await _cacheBaseRepository.CacheVersionAsync("localization") ?? VersionExtension.GenerateVersion(),
                LocalizationPublic = await _cacheBaseRepository.CacheVersionAsync("localization_public") ?? VersionExtension.GenerateVersion(),
            }
        };

        return response;
    }
}