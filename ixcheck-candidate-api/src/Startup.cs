using IXCheckCandidateApi.Globals;
using IXCheckCommonLib.AppFunctions;
using IXCheckCommonLib.AppFunctions.Interfaces;
using IXCheckCommonLib.AppValidations;
using IXCheckCommonLib.Globals;
using IXCheckCommonLib.Models;
using IXCheckCommonLib.Models.Interfaces;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Cors.Infrastructure;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Authorization;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using Serilog;
using Serilog.Events;
using System;
using System.Collections.Generic;
using System.IO;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Server.Kestrel.Core;
using IXCheckCandidateApi.Models;
using IXCheckCandidateApi.Models.Interfaces;
using Microsoft.Extensions.Hosting;
using Microsoft.OpenApi.Models;
using IXCheckCandidateApi.AppFunctions;
using IXCheckCandidateApi.AppFunctions.Interfaces;

using Microsoft.Extensions.Logging;

namespace IXCheckCandidateApi
{
    public class Startup
    {
        private IWebHostEnvironment _currentEnvironment { get; set; }
        /// <summary>
        /// Startup Constructor is used to set hosting environment
        /// </summary>
        /// <param name="env"></param>
        public Startup(IWebHostEnvironment __env)
        {
            _currentEnvironment = __env;
            var _builder = new ConfigurationBuilder()
                .SetBasePath(__env.ContentRootPath)
                .AddJsonFile(Constants.Api.AppSettingsJSON, optional: false, reloadOnChange: true)
                .AddEnvironmentVariables();
            Configuration = _builder.Build();
        }

        /// <summary>
        /// Get Configuration
        /// </summary>
        public IConfiguration Configuration { get; }

        /// <summary>
        /// This method gets called by the runtime. Use this method to add services to the container.
        /// </summary>
        /// <param name="services"></param>
        public void ConfigureServices(IServiceCollection services)
        {
            //add cors policy
            services.AddCors(options =>
            {
                AddCors(options);
            });

            services.AddMvc(option => option.EnableEndpointRouting = false);

            //Clear Default Logging Providers
            services.AddLogging(config =>
            {
                // clear out default configuration
                config.ClearProviders();
            });

            //Add Seri Log
            AddSeriLog();

            if (_currentEnvironment.IsDevelopment())
            {               
                // Register the Swagger generator, defining 1 or more Swagger documents
                services.AddSwaggerGen(config =>
                {
                    config.SwaggerDoc(Constants.Api.Version, new OpenApiInfo { Title = typeof(Startup).Namespace, Version = Constants.Api.Version });
                    config.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
                    {
                        Description = @"Authorization Format : Bearer {token}",
                        Name = "Authorization",
                        In = ParameterLocation.Header,
                        Type = SecuritySchemeType.ApiKey,
                        Scheme = "Bearer"
                    });

                    config.AddSecurityRequirement(new OpenApiSecurityRequirement()
                    {
                        {
                            new OpenApiSecurityScheme
                            {
                                Reference = new OpenApiReference
                                {
                                    Type = ReferenceType.SecurityScheme,
                                    Id = "Bearer"
                                },
                                Scheme = "JWT",
                                Name = "Bearer",
                                In = ParameterLocation.Header,
                            },
                            new List<string>()
                        }
                    });
                });
            }

            services.Configure<KestrelServerOptions>(options =>
            {
                options.AllowSynchronousIO = true;
            });

            //Add Cors
            services.AddCors();

            //Add mvc core middleware
            services.AddMvcCore(
            options =>
            {
                AddMvcCore(options);
            })
            .SetCompatibilityVersion(CompatibilityVersion.Latest)
            .AddApiExplorer()
            .AddAuthorization()
            .AddFormatterMappings();

            services.AddControllers().AddNewtonsoftJson();

            // Add Authorization
            services.AddAuthorization(_options =>
            {
                AddPolicies(_options);
            });

            var _jwtAppSettingOptions = Configuration.GetSection(nameof(JwtIssuerOptions));
            SymmetricSecurityKey _signingKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(_jwtAppSettingOptions[nameof(JwtIssuerOptions.SecurityKey)]));

            services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            }).AddJwtBearer(o =>
            {
                AuthenticateToken(o, _signingKey, _jwtAppSettingOptions);
            });

            services.Configure<JwtIssuerOptions>(_options =>
            {
                ConfigureJwtToken(_options, _signingKey, _jwtAppSettingOptions);
            });

            AddServices(services);
            services.AddSwaggerGenNewtonsoftSupport();
        }

        /// <summary>
        /// This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        /// </summary>
        /// <param name="app"></param>
        /// <param name="env"></param>
        public void Configure(IApplicationBuilder app, IHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                // Enable middleware to serve generated Swagger as a JSON endpoint.
                app.UseSwagger();

                // Enable middleware to serve swagger-ui (HTML, JS, CSS, etc.),
                // specifying the Swagger JSON endpoint.
                app.UseSwaggerUI(c =>
                {
                    c.SwaggerEndpoint("/swagger/v1/swagger.json", Constants.Api.Version + typeof(Startup).Namespace);
                });
            }

            app.UseRouting();
            //use cors policy
            app.UseCors(Constants.Api.CorsPolicy);
            app.UseAuthentication();
            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });

            app.UseMvc();
        }

        private void AddServices(IServiceCollection services)
        {
            services.AddScoped<IJwtIssuerOptions, JwtIssuerOptions>(_cfg => _cfg.GetService<IOptionsSnapshot<JwtIssuerOptions>>().Value);
            services.Configure<DatabaseSettings>(Configuration.GetSection(ApplicationConstants.ConfigSettingNames.DatabaseSettings));
            services.AddScoped<IDatabaseSettings, DatabaseSettings>(_cfg => _cfg.GetService<IOptionsSnapshot<DatabaseSettings>>().Value);
            services.Configure<ApiSettings>(Configuration.GetSection(ApplicationConstants.ConfigSettingNames.ApiSettings));
            services.AddScoped<IApiSettings, ApiSettings>(_cfg => _cfg.GetService<IOptionsSnapshot<ApiSettings>>().Value);
            services.Configure<LoggerSettings>(Configuration.GetSection(ApplicationConstants.ConfigSettingNames.LoggerSettings));
            services.AddScoped<ILoggerSettings, LoggerSettings>(_cfg => _cfg.GetService<IOptionsSnapshot<LoggerSettings>>().Value);
            services.Configure<PaymentSettings>(Configuration.GetSection(ApplicationConstants.ConfigSettingNames.PaymentSettings));
            services.AddScoped<IPaymentSettings, PaymentSettings>(_cfg => _cfg.GetService<IOptionsSnapshot<PaymentSettings>>().Value);
            services.AddScoped<ILoggerFunctions, LoggerFunctions>();
            services.AddScoped<IDatabaseFunctions, DatabaseFunctions>();
            services.AddScoped<ICacheFunctions, CacheFunctions>();
            services.AddScoped<IRedisService, RedisService>();
            services.AddScoped<IApiResponse, ApiResponse>();
            services.AddScoped<IStats, Stats>();
            services.AddScoped<IEmailFunctions, EmailFunctions>();
            services.AddScoped<IAssignmentFunctions, AssignmentFunctions>();
            services.AddScoped<IEmailSettings, EmailSettings>();
            services.AddScoped<IRegDataExportFunction, RegDataExportFunction>();
            services.AddScoped<IHttpClientFunctions, HttpClientFunctions>();
            services.AddScoped<IHttpClientFunction, HttpClientFunction>(); // For Remote POST requests
            services.AddScoped<IConnectionsMapping<string>, ConnectionsMapping<string>>(); // For Remote POST requests
            services.AddScoped<IRegistrationFunctions, RegistrationFunctions>();
            services.AddScoped<IOpenRegistrationFunctions, OpenRegistrationFunctions>();
            services.AddScoped<IPaymentGatewayFunctions, PaymentGatewayFunctions>();
            services.AddScoped<ISharedFunctions, SharedFunctions>();
            services.AddScoped<IImportFunctions, ImportFunctions>();
            services.AddScoped<ISyncRegistrationFunctions, SyncRegistrationFunctions>();
            services.AddScoped<IFileAndDirFunctions, FileAndDirFunctions>();
            services.AddScoped<IMockExamFunctions, MockExamFunctions>();

        }

        /// <summary>
        /// Add Mvc Core
        /// </summary>
        /// <param name="options"></param>
        private void AddMvcCore(MvcOptions options)
        {
            options.RequireHttpsPermanent = true; // this does not affect api requests
            options.RespectBrowserAcceptHeader = true; // false by default
            var _policy = new AuthorizationPolicyBuilder()
                            .RequireAuthenticatedUser()
                            .Build();
            options.Filters.Add(new AuthorizeFilter(_policy));
        }

        /// <summary>
        /// Add Cors
        /// </summary>
        /// <param name="options"></param>
        private void AddCors(CorsOptions options)
        {
            options.AddPolicy(Constants.Api.CorsPolicy,
               builder =>
               builder.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader());
        }

        /// <summary>
        /// Add Policies
        /// </summary>
        /// <param name="options"></param>
        private void AddPolicies(AuthorizationOptions options)
        {
            options.AddPolicy(JwtBearerDefaults.AuthenticationScheme, policy =>
            {
                policy.AddAuthenticationSchemes(JwtBearerDefaults.AuthenticationScheme);
                policy.RequireClaim(System.Security.Claims.ClaimTypes.NameIdentifier);
            });
        }

        /// <summary>
        /// Build Jwt Token Parameter
        /// </summary>
        /// <param name="signingKey"></param>
        /// <param name="jwtAppSettingOptions"></param>
        /// <returns></returns>
        private TokenValidationParameters BuildJwtTokenParameter(SymmetricSecurityKey signingKey, IConfigurationSection jwtAppSettingOptions)
        {
            var _tokenValidationParameters = new TokenValidationParameters
            {
                ValidateIssuer = true,
                ValidIssuer = jwtAppSettingOptions[nameof(JwtIssuerOptions.Issuer)],

                ValidateAudience = true,
                ValidAudience = jwtAppSettingOptions[nameof(JwtIssuerOptions.Audience)],

                ValidateIssuerSigningKey = true,
                IssuerSigningKey = signingKey,

                RequireExpirationTime = true,
                ValidateLifetime = true,

                ClockSkew = TimeSpan.FromMinutes(5)
            };
            return _tokenValidationParameters;
        }

        /// <summary>
        /// Authenticate Token
        /// </summary>
        /// <param name="options"></param>
        /// <param name="signingKey"></param>
        /// <param name="jwtAppSettingOptions"></param>
        private void AuthenticateToken(JwtBearerOptions options, SymmetricSecurityKey signingKey, IConfigurationSection jwtAppSettingOptions)
        {
            options.TokenValidationParameters = BuildJwtTokenParameter(signingKey, jwtAppSettingOptions);
            options.Events = new JwtBearerEvents()
            {
                OnChallenge = _context =>
                {
                    IApiResponse _apiResponse = new ApiResponse();
                    List<string> _errorMessage;
                    try
                    {
                        _context.Response.StatusCode = Convert.ToInt32(Constants.HttpStatusCodes.Unauthorized);
                        _context.HandleResponse();
                        _context.Response.ContentType = Constants.Api.ContentType;

                        var _error = string.Empty;
                        var _errorType = string.Empty;

                        if (_context.Error != null)
                        {
                            if (_context.Error.ToUpper() == Constants.ReturnMessageTypes.InvalidToken)
                            {
                                _errorType = Constants.ReturnMessageTypes.JwtInvalidUnauthrized;
                                _error = Constants.TokenMessages.InvalidToken;
                            }
                            else
                            {
                                _errorType = Constants.ReturnMessageTypes.JwtUnauthrized;
                                _error = Constants.TokenMessages.UnAuthorizedAccess;
                            }
                        }
                        else
                        {
                            _errorType = Constants.ReturnMessageTypes.JwtUnauthrized;
                            _error = Constants.TokenMessages.UnAuthorizedAccess;
                        }

                        _errorMessage = new List<string>{
                            { _error }
                         };
                        var _jsonError = _apiResponse.ErrorResponse(Constants.ReturnMessageTypes.TokenError, _errorType, _errorMessage, Constants.HttpStatusCodes.Unauthorized, true);
                        _context.Response.WriteAsync(_jsonError);
                        return Task.FromResult<object>(0);
                    }
                    catch (Exception ex)
                    {
                        _errorMessage = new List<string>{
                            { ex.Message }
                         };
                        _context.Response.StatusCode = Convert.ToInt32(Constants.HttpStatusCodes.InternalServerError);
                        _context.HandleResponse();
                        _context.Response.ContentType = Constants.Api.ContentType;
                        var _jsonError = _apiResponse.ErrorResponse(Constants.ReturnMessageTypes.SystemError, Constants.ReturnMessageTypes.UnhandeledException, _errorMessage, Constants.HttpStatusCodes.InternalServerError, true);
                        _context.Response.WriteAsync(_jsonError);
                        return Task.FromResult<object>(0);
                    }
                    finally { _apiResponse = null; _errorMessage = null; }
                }
            };
        }

        /// <summary>
        /// Configure Jwt Token
        /// </summary>
        /// <param name="options"></param>
        /// <param name="signingKey"></param>
        /// <param name="jwtAppSettingOptions"></param>
        private void ConfigureJwtToken(JwtIssuerOptions options, SymmetricSecurityKey signingKey, IConfigurationSection jwtAppSettingOptions)
        {
            options.Subject = jwtAppSettingOptions[nameof(JwtIssuerOptions.Subject)];
            options.ValidForMinutes = Int32.Parse(jwtAppSettingOptions[nameof(JwtIssuerOptions.ValidForMinutes)]);
            options.Issuer = jwtAppSettingOptions[nameof(JwtIssuerOptions.Issuer)];
            options.Audience = jwtAppSettingOptions[nameof(JwtIssuerOptions.Audience)];
            options.SigningCredentials = new SigningCredentials(signingKey, SecurityAlgorithms.HmacSha256);
        }

        /// <summary>
        /// Add SeriLog
        /// </summary>
        private void AddSeriLog()
        {
            //Set SeriLog.Log.Logger for Logging Values (SeriLog.Log class is static class)
            IConfigurationSection _seriLogconfigurationSection = Configuration.GetSection(Constants.SeriLog.ConfigSectionName);
            var _levelSwitch = new Serilog.Core.LoggingLevelSwitch()
            {
                MinimumLevel = (LogEventLevel)CommonFunctions.GetMinimumLevel(_seriLogconfigurationSection.GetValue<string>(Constants.SeriLog.MinimumLevel.MinimumLevelDefault))
            };
            Serilog.Log.Logger = new LoggerConfiguration()
            .ReadFrom.Configuration(_seriLogconfigurationSection)
            .MinimumLevel.ControlledBy(_levelSwitch)
            .MinimumLevel.Override(ApplicationConstants.SeriLog.MinimumLevel.IXCheckCandidateApi, (LogEventLevel)CommonFunctions.GetMinimumLevel(_seriLogconfigurationSection.GetValue<string>(ApplicationConstants.SeriLog.MinimumLevel.MinimumLevelOverrideIXCheckCandidateApi)))
            .Enrich.FromLogContext()
            .WriteTo.File(Path.Combine(_seriLogconfigurationSection.GetValue<string>(Constants.SeriLog.FilePath), _seriLogconfigurationSection.GetValue<string>(Constants.SeriLog.FileName))
            , retainedFileCountLimit: 100
            , shared: true
            , rollingInterval: RollingInterval.Day
            )
            .CreateLogger();
        }
    }
}