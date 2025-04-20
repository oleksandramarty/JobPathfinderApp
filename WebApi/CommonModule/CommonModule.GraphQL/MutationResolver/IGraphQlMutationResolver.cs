using CommonModule.Shared.Common.BaseInterfaces;
using CommonModule.Shared.Responses.Base;
using GraphQL.Types;
using MediatR;

namespace CommonModule.GraphQL.MutationResolver;

public interface IGraphQlMutationResolver
{
    void CreateEntity<TEntityInputType, TEntityType, TCommand, TEntityResponse>(GraphQlEndpoint endpoint)
        where TEntityType : ObjectGraphType<TEntityResponse>
        where TEntityInputType : InputObjectGraphType
        where TCommand : IRequest<TEntityResponse>;

    void UpdateEntity<TEntityInputType, TEntityTypeId, TEntityId, TCommand, TEntityResponse>(GraphQlEndpoint endpoint)
        where TEntityInputType : InputObjectGraphType
        where TEntityTypeId : ScalarGraphType
        where TCommand : IBaseIdEntity<TEntityId>, IRequest<TEntityResponse>;

    void DeleteEntity<TCommand, TEntityTypeId, TEntityId>(GraphQlEndpoint endpoint)
        where TEntityTypeId : ScalarGraphType
        where TCommand : IBaseIdEntity<TEntityId>, IRequest<BaseBoolResponse>, new();

}