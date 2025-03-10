using AutoMapper;
using CommonModule.Core.Mediatr;
using CommonModule.Interfaces;
using CommonModule.Shared.Responses.Base;
using CommonModule.Shared.Responses.Dictionaries.Models.Countries;
using CommonModule.Shared.Responses.Dictionaries.Models.Skills;
using Dictionaries.Domain;
using Dictionaries.Domain.Models.Countries;
using Dictionaries.Domain.Models.Skills;
using Dictionaries.Mediatr.Mediatr.Requests;
using MediatR;

namespace Dictionaries.Mediatr.Mediatr.Handlers;

public class SkillsRequestHandler(
    IDictionaryRepository<Guid, SkillEntity, SkillResponse, DictionariesDataContext> dictionaryRepository)
    : MediatrDictionaryBase<SkillsRequest, Guid, SkillEntity, SkillResponse, DictionariesDataContext>(
        dictionaryRepository), IRequestHandler<SkillsRequest, VersionedListResponse<SkillResponse>>;