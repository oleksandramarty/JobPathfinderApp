using System.Reflection;
using Autofac;
using MediatR;
using Profile.Mediatr.Mediatr.Profile.Commands;
using Profile.Mediatr.Mediatr.Profile.Requests;

namespace Profile.Mediatr;

public class MediatrProfileModule: Autofac.Module
{
    protected override void Load(ContainerBuilder builder)
    {
        builder.RegisterAssemblyTypes(typeof(IMediator).GetTypeInfo().Assembly)
            .AsImplementedInterfaces();
        
        builder.RegisterAssemblyTypes(typeof(UserProfileRequest).GetTypeInfo().Assembly).AsClosedTypesOf(typeof(IRequestHandler<>));
        
        builder.RegisterAssemblyTypes(typeof(AddUserSkillCommand).GetTypeInfo().Assembly).AsClosedTypesOf(typeof(IRequestHandler<>));
        builder.RegisterAssemblyTypes(typeof(UpdateUserSkillCommand).GetTypeInfo().Assembly).AsClosedTypesOf(typeof(IRequestHandler<>));
        builder.RegisterAssemblyTypes(typeof(RemoveUserSkillCommand).GetTypeInfo().Assembly).AsClosedTypesOf(typeof(IRequestHandler<>));
        builder.RegisterAssemblyTypes(typeof(AddUserLanguageCommand).GetTypeInfo().Assembly).AsClosedTypesOf(typeof(IRequestHandler<>));
        builder.RegisterAssemblyTypes(typeof(RemoveUserLanguageCommand).GetTypeInfo().Assembly).AsClosedTypesOf(typeof(IRequestHandler<>));
        builder.RegisterAssemblyTypes(typeof(UpdateUserLanguageCommand).GetTypeInfo().Assembly).AsClosedTypesOf(typeof(IRequestHandler<>));
        builder.RegisterAssemblyTypes(typeof(AddUserProfileItemCommand).GetTypeInfo().Assembly).AsClosedTypesOf(typeof(IRequestHandler<>));
        builder.RegisterAssemblyTypes(typeof(RemoveUserProfileItemCommand).GetTypeInfo().Assembly).AsClosedTypesOf(typeof(IRequestHandler<>));
        builder.RegisterAssemblyTypes(typeof(UpdateUserProfileItemCommand).GetTypeInfo().Assembly).AsClosedTypesOf(typeof(IRequestHandler<>));
        
    }
}