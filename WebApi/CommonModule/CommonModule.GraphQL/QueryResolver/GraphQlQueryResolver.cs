using CommonModule.Shared.Common.BaseInterfaces;
using CommonModule.Shared.Requests.Base;
using CommonModule.Shared.Responses.Base;
using GraphQL;
using GraphQL.Types;
using MediatR;
using Microsoft.Extensions.DependencyInjection;

namespace CommonModule.GraphQL.QueryResolver;

public class GraphQlQueryResolver : ObjectGraphType, IGraphQlQueryResolver
{
    public void EntityById<TEntityTypeId, TEntityType, TEntityId, TEntityResponse, TCommand, TCommandResponse>(
        GraphQlEndpoint endpoint)
        where TEntityType : ObjectGraphType<TEntityResponse>
        where TEntityTypeId : ScalarGraphType
        where TCommand : IBaseIdEntity<TEntityId>, IRequest<TCommandResponse>, new()
    {
        Field<TEntityType>(endpoint.Name)
            .Arguments(new QueryArguments(new QueryArgument<TEntityTypeId> { Name = "id" }))
            .ResolveAsync(async context =>
            {
                context.IsAuthenticated(endpoint.IsAuthenticated);
                var cancellationToken = context.CancellationToken;
                TCommand command = new TCommand();
                command.Id = context.GetArgument<TEntityId>("id");
                IMediator? mediator = context.RequestServices?.GetRequiredService<IMediator>();
                return await ExecuteCommandAsync<TCommandResponse>(mediator, command, cancellationToken, context);
            });
    }

    public void ResultForNonEmptyCommand<TEntityInputType, TEntityResponseType, TEntityResponse, TCommand,
        TCommandResponse>(GraphQlEndpoint endpoint)
        where TEntityInputType : InputObjectGraphType
        where TEntityResponseType : ObjectGraphType<TEntityResponse>
        where TCommand : IRequest<TCommandResponse>
    {
        Field<TEntityResponseType>(endpoint.Name)
            .Arguments(
                new QueryArgument<NonNullGraphType<TEntityInputType>> { Name = "input" })
            .ResolveAsync(async context =>
            {
                context.IsAuthenticated(endpoint.IsAuthenticated);
                var cancellationToken = context.CancellationToken;
                TCommand command = context.GetArgument<TCommand>("input");
                IMediator? mediator = context.RequestServices?.GetRequiredService<IMediator>();
                return await ExecuteCommandAsync<TCommandResponse>(mediator, command, cancellationToken, context);
            });
    }

    public void ResultForEmptyCommand<TEntityType, TEntityResponse, TCommand, TCommandResponse>(
        GraphQlEndpoint endpoint)
        where TEntityType : ObjectGraphType<TEntityResponse>
        where TCommand : IRequest<TCommandResponse>, new()
    {
        Field<TEntityType>(endpoint.Name)
            .ResolveAsync(async context =>
            {
                context.IsAuthenticated(endpoint.IsAuthenticated);
                var cancellationToken = context.CancellationToken;
                IMediator? mediator = context.RequestServices?.GetRequiredService<IMediator>();
                return await ExecuteCommandAsync<TCommandResponse>(mediator, new TCommand(), cancellationToken, context);
            });
    }

    public void FilteredEntities<TEntityType, TEntityResponse, TCommand>(GraphQlEndpoint endpoint)
        where TEntityType : ObjectGraphType<FilteredListResponse<TEntityResponse>>
        where TCommand : IBaseFilterRequest, IRequest<FilteredListResponse<TEntityResponse>>, new()
    {
        Field<TEntityType>(endpoint.Name)
            .Arguments(GraphQlExtension.PageableQueryArguments())
            .ResolveAsync(async context =>
            {
                context.IsAuthenticated(endpoint.IsAuthenticated);
                var cancellationToken = context.CancellationToken;
                TCommand command = context.FilterQuery<TCommand>();
                IMediator? mediator = context.RequestServices?.GetRequiredService<IMediator>();
                return await ExecuteCommandAsync<FilteredListResponse<TEntityResponse>>(mediator, command, cancellationToken, context);
            });
    }

    public void VersionedList<TEntityType, TEntityResponse, TCommand>(GraphQlEndpoint endpoint)
        where TEntityType : ObjectGraphType<VersionedListResponse<TEntityResponse>>
        where TCommand : IBaseVersionEntity, IRequest<VersionedListResponse<TEntityResponse>>, new()
    {
        Field<TEntityType>(endpoint.Name)
            .Arguments(new QueryArguments(new QueryArgument<StringGraphType> { Name = "version" }))
            .ResolveAsync(async context =>
            {
                context.IsAuthenticated(endpoint.IsAuthenticated);
                var cancellationToken = context.CancellationToken;
                IMediator? mediator = context.RequestServices?.GetRequiredService<IMediator>();
                TCommand command = new TCommand();
                command.Version = context.GetArgument<string>("version");
                return await ExecuteCommandAsync<VersionedListResponse<TEntityResponse>>(mediator, command, cancellationToken, context);
            });
    }

    public void ExecuteForEmptyCommand<TEntityType, TCommand, TCommandResponse>(GraphQlEndpoint endpoint)
        where TEntityType : ObjectGraphType<TCommandResponse>
        where TCommand : IRequest<TCommandResponse>, new()
    {
        Field<TEntityType>(endpoint.Name)
            .ResolveAsync(async context =>
            {
                context.IsAuthenticated(endpoint.IsAuthenticated);
                var cancellationToken = context.CancellationToken;
                IMediator? mediator = context.RequestServices?.GetRequiredService<IMediator>();
                return await ExecuteCommandAsync<TCommandResponse>(mediator, new TCommand(), cancellationToken, context);;
            });
    }
    
    public async Task<TCommandResponse?> ExecuteCommandAsync<TCommandResponse>(IMediator? mediator, IRequest<TCommandResponse> command, CancellationToken cancellationToken, IResolveFieldContext context)
    {
        if (mediator == null)
        {
            context.Errors.Add(new ExecutionError("Mediator not found"));
            return default;
        }
        return await mediator.Send(command, cancellationToken);
    }
    
    public async Task ExecuteCommandAsync(IMediator? mediator, IRequest command, CancellationToken cancellationToken, IResolveFieldContext context)
    {
        if (mediator == null)
        {
            context.Errors.Add(new ExecutionError("Mediator not found"));
            return;
        }
        
        await mediator.Send(command, cancellationToken);
    }
}