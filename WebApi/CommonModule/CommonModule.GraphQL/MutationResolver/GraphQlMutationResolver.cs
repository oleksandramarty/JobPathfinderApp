using CommonModule.Shared.Common.BaseInterfaces;
using CommonModule.Shared.Responses.Base;
using GraphQL;
using GraphQL.Types;
using MediatR;
using Microsoft.Extensions.DependencyInjection;

namespace CommonModule.GraphQL.MutationResolver;

public class GraphQlMutationResolver: ObjectGraphType, IGraphQlMutationResolver
{
    public void CreateEntity<TEntityInputType, TEntityType, TCommand, TEntityResponse>(GraphQlEndpoint endpoint)
        where TEntityType : ObjectGraphType<TEntityResponse>
        where TEntityInputType : InputObjectGraphType
        where TCommand : IRequest<TEntityResponse>
    {
        Field<TEntityType>(endpoint.Name)
            .Arguments(new QueryArguments(
                new QueryArgument<NonNullGraphType<TEntityInputType>> { Name = "input" }
            ))
            .ResolveAsync(async context =>
            {
                context.IsAuthenticated(endpoint.IsAuthenticated);
                var cancellationToken = context.CancellationToken;
                TCommand command = context.GetArgument<TCommand>("input");
                IMediator? mediator = context.RequestServices?.GetRequiredService<IMediator>();
                TEntityResponse result = await ExecuteCommandAsync(mediator, command, cancellationToken, context);
                return result;
            });
    }
    
    public void UpdateEntity<TEntityInputType, TEntityTypeId, TEntityId, TCommand>(GraphQlEndpoint endpoint)
        where TEntityInputType : InputObjectGraphType
        where TEntityTypeId : ScalarGraphType
        where TCommand : IBaseIdEntity<TEntityId>, IRequest
    {
        Field<BooleanGraphType>(endpoint.Name)
            .Arguments(new QueryArguments(
                new QueryArgument<NonNullGraphType<TEntityTypeId>> { Name = "id" },
                new QueryArgument<NonNullGraphType<TEntityInputType>> { Name = "input" }
            ))
            .ResolveAsync(async context =>
            {
                context.IsAuthenticated(endpoint.IsAuthenticated);
                var cancellationToken = context.CancellationToken;
                TCommand command = context.GetArgument<TCommand>("input");
                command.Id = context.GetArgument<TEntityId>("id");
                IMediator? mediator = context.RequestServices?.GetRequiredService<IMediator>();
                await ExecuteCommandAsync(mediator, command, cancellationToken, context);
                return true;
            });
    }
    
    public void DeleteEntity<TCommand, TEntityTypeId, TEntityId>(GraphQlEndpoint endpoint)
        where TEntityTypeId : ScalarGraphType
        where TCommand : IBaseIdEntity<TEntityId>, IRequest<BaseBoolResponse>, new()
    {
        Field<BooleanGraphType>(endpoint.Name)
            .Arguments(new QueryArguments(
                new QueryArgument<NonNullGraphType<TEntityTypeId>> { Name = "id" }
            ))
            .ResolveAsync(async context =>
            {
                context.IsAuthenticated(endpoint.IsAuthenticated);
                var cancellationToken = context.CancellationToken;
                TCommand command = new TCommand
                {
                    Id = context.GetArgument<TEntityId>("id")
                };
                IMediator? mediator = context.RequestServices?.GetRequiredService<IMediator>();
                await ExecuteCommandAsync<BaseBoolResponse>(mediator, command, cancellationToken, context);
                return true;
            });
    }
    
    private async Task<TCommandResponse?> ExecuteCommandAsync<TCommandResponse>(IMediator? mediator, IRequest<TCommandResponse> command, CancellationToken cancellationToken, IResolveFieldContext context)
    {
        if (mediator == null)
        {
            context.Errors.Add(new ExecutionError("Mediator not found"));
            return default;
        }
        
        return await mediator.Send(command, cancellationToken);
    }
    
    private async Task ExecuteCommandAsync(IMediator? mediator, IRequest command, CancellationToken cancellationToken, IResolveFieldContext context)
    {
        if (mediator == null)
        {
            context.Errors.Add(new ExecutionError("Mediator not found"));
            return;
        }
        
        await mediator.Send(command, cancellationToken);
    }
}