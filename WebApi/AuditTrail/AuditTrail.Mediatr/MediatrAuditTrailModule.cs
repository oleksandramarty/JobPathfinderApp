using System.Reflection;
using AuditTrail.Mediatr.Mediatr.Requests;
using Autofac;
using MediatR;

namespace AuditTrail.Mediatr;

public class MediatrAuditTrailModule: Autofac.Module
{
    protected override void Load(ContainerBuilder builder)
    {
        builder.RegisterAssemblyTypes(typeof(IMediator).GetTypeInfo().Assembly)
            .AsImplementedInterfaces();
        
        builder.RegisterAssemblyTypes(typeof(FilteredAuditTrailRequest).GetTypeInfo().Assembly).AsClosedTypesOf(typeof(IRequestHandler<,>));
    }
}