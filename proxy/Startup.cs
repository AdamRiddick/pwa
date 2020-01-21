using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;
using System.IdentityModel.Tokens.Jwt;
using System.IO;

using Microsoft.AspNetCore.Authentication;
using Microsoft.IdentityModel.Tokens;
using ProxyKit;
using IdentityModel.Client;

using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.FileProviders;

using proxy.Configuration;
using proxy.Middleware;

namespace proxy
{
    public class Startup
    {
        private readonly IConfiguration _configuration;

        public Startup(IConfiguration configuration)
        {
            _configuration = configuration;

            JwtSecurityTokenHandler.DefaultInboundClaimTypeMap.Clear();
        }

        public void ConfigureServices(IServiceCollection services)
        {
            // Add proxy kit services
            services.AddProxy();

            // Automatic token management
            services.AddAccessTokenManagement();

            // Rest of application guff and auth setup.
            services.AddMvcCore(options => options.EnableEndpointRouting = false)
                .AddAuthorization();

            services.AddAuthentication(options =>
            {
                options.DefaultScheme = "cookies";
                options.DefaultChallengeScheme = "oidc";
            })
            .AddCookie("cookies", options =>
            {
                options.Cookie.Name = "spaproxy";
                options.Cookie.SameSite = SameSiteMode.Strict;
            })
            .AddOpenIdConnect("oidc", options =>
            {
                options.Authority = "https://demo.identityserver.io";
                options.ClientId = "server.hybrid";
                options.ClientSecret = "secret"; //Should be protected using the available data protection APIs

                options.ResponseType = "code id_token";
                options.GetClaimsFromUserInfoEndpoint = true;

                options.Scope.Clear();
                options.Scope.Add("openid");
                options.Scope.Add("profile");
                options.Scope.Add("api");
                options.Scope.Add("offline_access");

                options.SaveTokens = true;

                options.TokenValidationParameters = new TokenValidationParameters
                {
                    NameClaimType = "name",
                    RoleClaimType = "role"
                };
            });
        }

        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            app.UseDeveloperExceptionPage();

            // 1. Need this to solve issue with cookie redirects form external providers.
            app.UseMiddleware<SameSiteCookieRedirectMiddleware>();
            app.UseAuthentication();

            // App guff - middleware to challenge login if not authenticated on any action.
            app.Use(async (context, next) =>
            {
                if (!context.User.Identity.IsAuthenticated)
                {
                    await context.ChallengeAsync();
                    return;
                }

                await next();
            });

            // Gather our API Settings
            var apiSettings = new ApiSettings();
            _configuration.GetSection("ApiSettings").Bind(apiSettings);

            foreach (var apiProxy in apiSettings.Proxies)
            {
                // 2. The magic - it all happens here
                // Branch the request pipeline for /path and executes the branch middleware
                app.Map(apiProxy.Path, api =>
                {
                    // RunProxy is a feature of ProxyKit, does the heavy lifting for us.
                    api.RunProxy(async context =>
                    {
                        // We are saying, any request that comes to the /path path
                        // forward exactly as is to the URL defined next.
                        var forwardContext = context.ForwardTo(apiProxy.ForwardingUrl);

                        // But just before we send the forwarded request, we add the current users access token.
                        // We have access to it here as the UI is served from this application
                        // UI files are all in wwwroot. We use the default of index.html, so it doesn't really matter what happens in there
                        // as long as it results in there being an index.html.
                        var token = await context.GetUserAccessTokenAsync();
                        forwardContext.UpstreamRequest.SetBearerToken(token);

                        return await forwardContext.Send();
                    });
                });
            }

            app.UseDefaultFiles();
            // Serve wwwroot/dist as a root 
            app.UseStaticFiles();
            app.UseMvc();
        }
    }
}
