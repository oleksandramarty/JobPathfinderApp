using CommonModule.Core.Mediatr;
using CommonModule.Interfaces;
using CommonModule.Shared.Responses.Base;
using CommonModule.Shared.Responses.Localizations.Models.Locales;
using Localizations.Domain;
using Localizations.Domain.Models.Locales;
using Localizations.Mediatr.Mediatr.Localizations.Requests;
using MediatR;

namespace Localizations.Mediatr.Mediatr.Localizations.Handlers;

public class LocalesRequestHandler : IRequestHandler<LocalesRequest, VersionedListResponse<LocaleResponse>>
{
    private readonly IDictionaryRepository<int, LocaleEntity, LocaleResponse, LocalizationsDataContext> _dictionaryRepository;
    
    public LocalesRequestHandler(
        IDictionaryRepository<int, LocaleEntity, LocaleResponse, LocalizationsDataContext> dictionaryRepository
        )
    {
        _dictionaryRepository = dictionaryRepository;
    }
    
    public async Task<VersionedListResponse<LocaleResponse>> Handle(LocalesRequest request, CancellationToken cancellationToken)
    {
        VersionedListResponse<LocaleResponse> response = await _dictionaryRepository.DictionaryAsync(request.Version, cancellationToken);

        response.Items = response.Items.OrderBy(i => i.Id).ToList();
        
        return response;
    }
}