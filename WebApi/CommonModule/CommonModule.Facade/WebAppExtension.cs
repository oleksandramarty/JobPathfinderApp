using System.Text;
using Amazon.DynamoDBv2;
using Amazon.DynamoDBv2.DataModel;
using AuditTrail.Business;
using CommonModule.Core.Exceptions;
using CommonModule.Core.Extensions;
using CommonModule.Core.Filters;
using CommonModule.Core.Kafka;
using CommonModule.Interfaces;
using CommonModule.Repositories;
using CommonModule.Shared.Constants;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using GraphQL;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using StackExchange.Redis;

namespace CommonModule.Facade;

public static class WebAppExtension
{
    #region Auth

    public static void AddAuthorization(this WebApplicationBuilder builder)
    {
        builder.Services.AddAuthorization(options =>
        {
            options.AddPolicy("AuthorizedPolicy", policy =>
                policy.RequireAuthenticatedUser());
        });
    }

    public static void AddJwtAuthentication(this WebApplicationBuilder builder)
    {
        string? secretKey = builder.Configuration["Authentication:Jwt:SecretKey"];
        
        if (string.IsNullOrEmpty(secretKey))
        {
            throw new ArgumentNullException(nameof(secretKey), "SecretKey cannot be null or empty.");
        }
        
        byte[] key = Encoding.UTF8.GetBytes(secretKey);

        builder.Services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            })
            .AddJwtBearer(AuthSchema.Schema, options =>
            {
                options.RequireHttpsMetadata = false;
                options.SaveToken = true;
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(key),
                    ValidateIssuer = false,
                    ValidateAudience = false
                };
            });
    }

    public static void UseTokenValidator(this IApplicationBuilder app)
    {
        app.Use(async (context, next) =>
        {
            var tokenRepository = context.RequestServices.GetRequiredService<ITokenRepository>();
            var token = context.Request.Headers["Authorization"].ToString().Split(' ').Last();

            if (!string.IsNullOrEmpty(token) &&
                !await tokenRepository.IsTokenValidAsync(token))
            {
                var tokenFactory = context.RequestServices.GetRequiredService<IJwtTokenFactory>();

                if (tokenRepository.IsTokenExpired(token) && tokenFactory.IsTokenRefreshable(token))
                {
                    var newToken = tokenFactory.GenerateNewJwtToken(context.User);
                    context.Response.Headers.Add("Authorization", $"{AuthSchema.Schema} {newToken}");
                }
                else
                {
                    throw new Exception("COMMON.UNAUTHORIZED_ACCESS");
                }
            }

            await next();
        });
    }

    #endregion

    #region Cors

    public static void AddCorsPolicy(this WebApplicationBuilder builder)
    {
        string origin = builder.Configuration.GetValue<string>("Origin") ?? string.Empty;

        builder.Services.AddCors(options =>
        {
            options.AddPolicy("AllowSpecificOrigins",
                b =>
                {
                    b.WithOrigins(origin.Split(","))
                        .AllowAnyHeader()
                        .AllowAnyMethod()
                        .AllowCredentials();
                });
        });
    }

    #endregion

    #region Databases

    public static void AddDatabaseContext<TDataContext>(this WebApplicationBuilder builder,
        string dbName = "Database")
        where TDataContext : DbContext
    {
        var temp = builder.Configuration.GetConnectionString(dbName);
        builder.Services.AddDbContext<TDataContext>(options =>
            options.UseNpgsql(temp));
    }

    public static void AddDynamoDb(this WebApplicationBuilder builder)
    {
        var dynamoDbConfig = new AmazonDynamoDBConfig
        {
            ServiceURL = builder.Configuration["DynamoDB:ServiceURL"]
        };

        builder.Services.AddSingleton<IAmazonDynamoDB>(sp => new AmazonDynamoDBClient(dynamoDbConfig));
        builder.Services.AddSingleton<IDynamoDBContext, DynamoDBContext>();
    }

    #endregion

    #region DependencyInjection

    public static void AddDependencyInjection(this WebApplicationBuilder builder)
    {
        builder.Services.AddHttpContextAccessor();

        builder.Services.AddScoped(typeof(IEntityValidator<>), typeof(EntityValidator<>));

        builder.Services.AddScoped(typeof(IReadGenericRepository<,,>), typeof(GenericRepository<,,>));
        builder.Services.AddScoped(typeof(IGenericRepository<,,>), typeof(GenericRepository<,,>));

        builder.Services.AddScoped<ICurrentUserRepository, CurrentUserRepository>();
        builder.Services.AddScoped<IJwtTokenFactory, JwtTokenFactory>();

        string? redisConnectionString = builder.Configuration.GetSection("Redis")["ConnectionString"];
        if (string.IsNullOrEmpty(redisConnectionString))
        {
            throw new ArgumentNullException(nameof(redisConnectionString), "Redis connection string cannot be null or empty.");
        }
        
        builder.Services.AddSingleton<IConnectionMultiplexer>(ConnectionMultiplexer.Connect(redisConnectionString));

        // Register Kafka services
        builder.Services.AddScoped<KafkaProducer>();
        builder.Services.AddScoped<IKafkaMessageService, KafkaMessageService>();

        // Redis
        builder.Services.AddScoped<ITokenRepository, RedisTokenRepository>();
        builder.Services.AddScoped<ILocalizationRepository, RedisLocalizationRepository>();
        builder.Services.AddScoped(typeof(ICacheRepository<,>), typeof(RedisCacheRepository<,>));
        builder.Services.AddScoped(typeof(ICacheBaseRepository<>), typeof(RedisCacheBaseRepository<>));

        builder.Services.AddScoped(typeof(IDictionaryRepository<,,,>), typeof(DictionaryRepository<,,,>));
        builder.Services.AddScoped(typeof(ITreeDictionaryRepository<,,,,>), typeof(TreeDictionaryRepository<,,,,>));
    }

    #endregion

    #region Swagger

    public static void AddSwagger(this WebApplicationBuilder builder, bool addAdditionalTypes = false)
    {
        builder.Services.AddOpenApiDocument(config =>
        {
            config.DocumentName = "v1";
            config.AddGraphQLModels(addAdditionalTypes);
            config.Title = builder.Configuration["Microservice:Title"] ?? "API";
            config.Version = builder.Configuration.GetMicroserviceVersion();

            config.PostProcess = document =>
            {
                document.Info.Version = builder.Configuration.GetMicroserviceVersion();
                document.Info.Title = builder.Configuration["Microservice:Title"] ?? "API";
            };
        });

        builder.Services.AddEndpointsApiExplorer();
        builder.Services.AddSwaggerGen(c =>
        {
            string version = builder.Configuration.GetMicroserviceVersion();
            c.SwaggerDoc(version, new OpenApiInfo { 
                Title = builder.Configuration["Microservice:Title"], 
                Version = version 
            });

            c.AddSecurityDefinition(AuthSchema.Schema, new OpenApiSecurityScheme
            {
                Description = @$"JWT Authorization header using the {AuthSchema.Schema} scheme. 
                                Enter '{AuthSchema.Schema}' [space] and then your token below.
                                Example: '{AuthSchema.Schema} 12345abcdef'",
                Name = "Authorization",
                In = ParameterLocation.Header,
                Type = SecuritySchemeType.ApiKey,
                Scheme = AuthSchema.Schema
            });

            c.OperationFilter<CustomOperationIdFilter>();

            c.AddSecurityRequirement(new OpenApiSecurityRequirement()
            {
                {
                    new OpenApiSecurityScheme
                    {
                        Reference = new OpenApiReference
                        {
                            Type = ReferenceType.SecurityScheme,
                            Id = AuthSchema.Schema
                        },
                        Scheme = "oauth2",
                        Name = AuthSchema.Schema,
                        In = ParameterLocation.Header,
                    },
                    new List<string>()
                }
            });
        });
    }



    #endregion
    
    #region Middleware

    public static void AddMiddlewares(this IApplicationBuilder app)
    {
        app.UseMiddleware<ExceptionHandlingMiddleware>();
    }

    #endregion
    
    #region GraphQL

    public static void AddGraphQl(this WebApplicationBuilder builder)
    {
        builder.Services.AddGraphQL(options =>
            options.ConfigureExecution((opt, next) =>
                {
                    opt.EnableMetrics = true;
                    opt.ThrowOnUnhandledException = true;
                    return next(opt);
                })
                .AddSystemTextJson()
        );
    }

    #endregion
}