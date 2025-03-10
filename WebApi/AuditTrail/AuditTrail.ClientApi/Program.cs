using AuditTrail.Business;
using AuditTrail.Domain;
using AuditTrail.Mediatr;
using AuditTrail.Mediatr.Mediatr.Requests;
using AuditTrail.Mediatr.Strategies.FilteredResult;
using AuthGateway.Mediatr;
using Autofac;
using Autofac.Extensions.DependencyInjection;
using CommonModule.Core.Extensions;
using CommonModule.Core.Strategies.FilteredResult;
using CommonModule.Facade;
using CommonModule.Shared.Responses.AuditTrail;

var builder = WebApplication.CreateBuilder(args);

if (builder.Environment.IsDevelopment())
{
    builder.Configuration.AddUserSecrets<Program>();
}

builder.AddDatabaseContext<AuditTrailDataContext>();
builder.AddDynamoDb();
builder.AddSwagger();
builder.AddCorsPolicy();
builder.AddAuthorization();

builder.AddJwtAuthentication();
builder.AddDependencyInjection();

// Add controllers
builder.Services.AddControllers();

// Fluent validation starts
// Fluent validation ends

// Custom DI
builder.Services.AddScoped<IAuditTrailRepository, AuditTrailRepository>();
// Custom DI ends

// AutoMapper
builder.Services.AddAutoMapper(config => { config.AddProfile(new MappingAuditTrailProfile()); });
// AutoMapper ends

builder.Host.UseServiceProviderFactory(new AutofacServiceProviderFactory());
builder.Services.AddMediatR(cfg => cfg.RegisterServicesFromAssembly(typeof(Program).Assembly));

// MediatR modules
builder.Host.ConfigureContainer<ContainerBuilder>(opts => { opts.RegisterModule(new MediatrAuditTrailModule()); });
builder.Host.ConfigureContainer<ContainerBuilder>(opts => { opts.RegisterModule(new MediatrCommonModule()); });
// MediatR modules ends

// Strategies
builder.Services.AddScoped<IFilteredResultStrategy<FilteredAuditTrailRequest, AuditTrailResponse>, FilteredResultOfAuditTrailStrategy>();
// Strategies end

var app = builder.Build();

app.AddMiddlewares();
app.UseSwagger();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", builder.Configuration.GetSwaggerEndpointName());
    });
}

app.UseCors("AllowSpecificOrigins");
app.UseStaticFiles();
app.UseRouting();
app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();
app.UseTokenValidator();
app.MapControllers();

app.Run();