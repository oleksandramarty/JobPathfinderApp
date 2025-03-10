using CommonModule.Core.Extensions;
using CommonModule.Facade;

var builder = WebApplication.CreateBuilder(args);
builder.AddSwagger(true);
builder.AddCorsPolicy();
builder.AddAuthorization();

builder.AddJwtAuthentication();
builder.AddDependencyInjection();

// Add controllers
builder.Services.AddControllers();

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