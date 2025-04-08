using System.Reflection;
using Autofac;
using CommonModule.Core.Mediatr.Requests;
using MediatR;

namespace AuthGateway.Mediatr;

public class MediatrCommonModule: Autofac.Module
{
    protected override void Load(ContainerBuilder builder)
    {
        builder.RegisterAssemblyTypes(typeof(IMediator).GetTypeInfo().Assembly)
            .AsImplementedInterfaces();
        
        builder.RegisterAssemblyTypes(typeof(GetUserIdRequest).GetTypeInfo().Assembly).AsClosedTypesOf(typeof(IRequestHandler<,>));
    }
}