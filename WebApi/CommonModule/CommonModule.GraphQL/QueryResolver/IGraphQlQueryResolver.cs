using CommonModule.GraphQL.Types.Common;
using CommonModule.Shared;
using CommonModule.Shared.Common.BaseInterfaces;
using CommonModule.Shared.Requests.Base;
using CommonModule.Shared.Responses.Base;
using GraphQL.Types;
using MediatR;

namespace CommonModule.GraphQL.QueryResolver;

public interface IGraphQlQueryResolver
{
    void EntityById<TEntityTypeId, TEntityType, TEntityId, TEntityResponse, TCommand, TCommandResponse>(GraphQlEndpoint endpoint)
        where TEntityType : ObjectGraphType<TEntityResponse>
        where TEntityTypeId : ScalarGraphType
        where TCommand : IBaseIdEntity<TEntityId>, IRequest<TCommandResponse>, new();

    void ResultForNonEmptyCommand<TEntityInputType, TEntityResponseType, TEntityResponse, TCommand, TCommandResponse>(GraphQlEndpoint endpoint)
        where TEntityInputType : InputObjectGraphType
        where TEntityResponseType : ObjectGraphType<TEntityResponse>
        where TCommand : IRequest<TCommandResponse>;

    void ResultForEmptyCommand<TEntityType, TEntityResponse, TCommand, TCommandResponse>(GraphQlEndpoint endpoint)
        where TEntityType : ObjectGraphType<TEntityResponse>
        where TCommand : IRequest<TCommandResponse>, new();

    void FilteredEntities<TEntityType, TEntityResponse, TCommand>(GraphQlEndpoint endpoint)
        where TEntityType : ObjectGraphType<FilteredListResponse<TEntityResponse>>
        where TCommand : IBaseFilterRequest, IRequest<FilteredListResponse<TEntityResponse>>, new();

    void VersionedList<TEntityType, TEntityResponse, TCommand>(GraphQlEndpoint endpoint)
        where TEntityType : ObjectGraphType<VersionedListResponse<TEntityResponse>>
        where TCommand : IBaseVersionEntity, IRequest<VersionedListResponse<TEntityResponse>>, new();
    
    void ExecuteForEmptyCommand<TEntityType, TCommand, TCommandResponse>(GraphQlEndpoint endpoint)
        where TEntityType : ObjectGraphType<TCommandResponse>
        where TCommand : IRequest<TCommandResponse>, new();
}