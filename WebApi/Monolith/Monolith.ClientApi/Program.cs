using AuditTrail.Business;
using AuditTrail.Domain;
using AuditTrail.Mediatr;
using AuditTrail.Mediatr.Mediatr.Requests;
using AuditTrail.Mediatr.Strategies.FilteredResult;
using AuthGateway.Domain;
using AuthGateway.Mediatr;
using AuthGateway.Mediatr.Validators.Auth;
using Autofac;
using Autofac.Extensions.DependencyInjection;
using CommonModule.Core.Extensions;
using CommonModule.Core.Strategies.FilteredResult;
using CommonModule.Facade;
using CommonModule.Shared.Responses.AuditTrail;
using Dictionaries.Domain;
using Dictionaries.Mediatr;
using FluentValidation;
using GraphQL.MicrosoftDI;
using GraphQL.Types;
using Localizations.Domain;
using Localizations.Mediatr;
using Monolith.GraphQL;
using Profile.Domain;
using Profile.Mediatr;

namespace Monolith.ClientApi;

public class Program
{
    public static void Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);

        if (builder.Environment.IsDevelopment() || builder.Environment.EnvironmentName == "DevelopmentMonolith")
        {
            builder.Configuration.AddUserSecrets<Program>();
        }

        builder.AddDatabaseContext<AuditTrailDataContext>("AuditTrailDb");
        builder.AddDatabaseContext<ProfileDataContext>("ProfileDb");
        builder.AddDatabaseContext<LocalizationsDataContext>("LocalizationDb");
        builder.AddDatabaseContext<DictionariesDataContext>("DictionaryDb");
        builder.AddDatabaseContext<AuthGatewayDataContext>("UserDb");
        builder.AddDynamoDb();
        builder.AddSwagger(true);
        builder.AddCorsPolicy();
        builder.Services.AddControllers();
        builder.AddAuthorization();

        builder.AddJwtAuthentication();
        builder.AddDependencyInjection();

        // Fluent validation starts
        builder.Services.AddValidatorsFromAssemblyContaining<AuthSignUpCommandValidator>();
        // Fluent validation ends

        // GraphQL schema
        builder.Services.AddSingleton<ISchema, MonolithGraphQLSchema>(services =>
            new MonolithGraphQLSchema(new SelfActivatingServiceProvider(services)));
        // GraphQL schema ends

        builder.AddGraphQl();

        // Custom DI
        builder.Services.AddScoped<IAuditTrailRepository, AuditTrailRepository>();
        // Custom DI ends

        // AutoMapper
        builder.Services.AddAutoMapper(config =>
        {
            config.AddProfile(new MappingProfileProfile());
            config.AddProfile(new MappingLocalizationsProfile());
            config.AddProfile(new MappingDictionariesProfile());
            config.AddProfile(new MappingAuthProfile());
            config.AddProfile(new MappingAuditTrailProfile());
        });
        // AutoMapper ends

        builder.Host.UseServiceProviderFactory(new AutofacServiceProviderFactory());
        builder.Services.AddMediatR(cfg => cfg.RegisterServicesFromAssembly(typeof(Program).Assembly));

        // MediatR modules
        builder.Host.ConfigureContainer<ContainerBuilder>(opts => { opts.RegisterModule(new MediatrProfileModule()); });
        builder.Host.ConfigureContainer<ContainerBuilder>(opts => { opts.RegisterModule(new MediatorLocalizationsModule()); });
        builder.Host.ConfigureContainer<ContainerBuilder>(opts => { opts.RegisterModule(new MediatrDictionariesModule()); });
        builder.Host.ConfigureContainer<ContainerBuilder>(opts => { opts.RegisterModule(new MediatrAuthModule()); });
        builder.Host.ConfigureContainer<ContainerBuilder>(opts => { opts.RegisterModule(new MediatrCommonModule()); });
        builder.Host.ConfigureContainer<ContainerBuilder>(opts => { opts.RegisterModule(new MediatrAuditTrailModule()); });
        // MediatR modules ends

        // Strategies
        builder.Services
            .AddScoped<IFilteredResultStrategy<FilteredAuditTrailRequest, AuditTrailResponse>,
                FilteredResultOfAuditTrailStrategy>();
        // Strategies end

        var app = builder.Build();

        app.AddMiddlewares();

        // Configure the HTTP request pipeline.
        if (app.Environment.IsDevelopment() || app.Environment.EnvironmentName == "DevelopmentMonolith")
        {
            app.UseSwaggerUI(c =>
            {
                c.SwaggerEndpoint("/swagger/v1/swagger.json", builder.Configuration.GetSwaggerEndpointName());
            });
            app.UseGraphQLPlayground("/graphql/playground");
        }

        app.UseCors("AllowSpecificOrigins");
        app.UseStaticFiles();
        app.UseRouting();
        app.UseHttpsRedirection();
        app.UseAuthentication();
        app.UseAuthorization();
        app.UseTokenValidator();
        app.MapControllers();
        app.UseGraphQL();

        app.Run();
    }
}