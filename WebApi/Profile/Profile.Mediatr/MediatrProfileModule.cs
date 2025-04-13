using System.Reflection;
using Autofac;
using MediatR;
using Profile.Mediatr.Mediatr.Profile.Commands;

namespace Profile.Mediatr;

public class MediatrProfileModule: Autofac.Module
{
    protected override void Load(ContainerBuilder builder)
    {
        builder.RegisterAssemblyTypes(typeof(IMediator).GetTypeInfo().Assembly)
            .AsImplementedInterfaces();
        
        builder.RegisterAssemblyTypes(typeof(UpdateProfileCommand).GetTypeInfo().Assembly).AsClosedTypesOf(typeof(IRequestHandler<>));
    }
}