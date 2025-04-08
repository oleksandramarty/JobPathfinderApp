using System.Reflection;
using Autofac;
using Localizations.Mediatr.Mediatr.Localizations.Requests;
using MediatR;

namespace Localizations.Mediatr;

public class MediatorLocalizationsModule: Autofac.Module
{
    protected override void Load(ContainerBuilder builder)
    {
        builder.RegisterAssemblyTypes(typeof(IMediator).GetTypeInfo().Assembly)
            .AsImplementedInterfaces();

        builder.RegisterAssemblyTypes(typeof(LocalesRequest).GetTypeInfo().Assembly).AsClosedTypesOf(typeof(IRequestHandler<,>));
        builder.RegisterAssemblyTypes(typeof(LocalizationsRequest).GetTypeInfo().Assembly).AsClosedTypesOf(typeof(IRequestHandler<,>));
    }
}