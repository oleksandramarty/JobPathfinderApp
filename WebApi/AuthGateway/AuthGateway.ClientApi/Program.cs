using AuthGateway.Domain;
using AuthGateway.GraphQL;
using AuthGateway.Mediatr;
using AuthGateway.Mediatr.Validators.Auth;
using Autofac;
using Autofac.Extensions.DependencyInjection;
using CommonModule.Core.Extensions;
using CommonModule.Facade;
using FluentValidation;
using GraphQL.MicrosoftDI;
using GraphQL.Types;

var builder = WebApplication.CreateBuilder(args);

if (builder.Environment.IsDevelopment())
{
    builder.Configuration.AddUserSecrets<Program>();
}

builder.AddDatabaseContext<AuthGatewayDataContext>();
builder.AddDynamoDb();
builder.AddSwagger();
builder.AddCorsPolicy();
builder.AddAuthorization();

builder.AddJwtAuthentication();
builder.AddDependencyInjection();

// Add controllers
builder.Services.AddControllers();

// Fluent validation starts
builder.Services.AddValidatorsFromAssemblyContaining<AuthSignUpCommandValidator>();
// Fluent validation ends

// GraphQL schema
builder.Services.AddSingleton<ISchema, AuthGatewayGraphQLSchema>(services => new AuthGatewayGraphQLSchema(new SelfActivatingServiceProvider(services)));
// GraphQL schema ends

builder.AddGraphQl();

// Custom DI
// Custom DI ends

// AutoMapper
builder.Services.AddAutoMapper(config => { config.AddProfile(new MappingAuthProfile()); });
// AutoMapper ends

builder.Host.UseServiceProviderFactory(new AutofacServiceProviderFactory());
builder.Services.AddMediatR(cfg => cfg.RegisterServicesFromAssembly(typeof(Program).Assembly));

// MediatR modules
builder.Host.ConfigureContainer<ContainerBuilder>(opts => { opts.RegisterModule(new MediatrAuthModule()); });
builder.Host.ConfigureContainer<ContainerBuilder>(opts => { opts.RegisterModule(new MediatrCommonModule()); });
// MediatR modules ends

// Strategies
// Strategies end

var app = builder.Build();

app.AddMiddlewares();

app.AddMiddlewares();
app.UseSwagger();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
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