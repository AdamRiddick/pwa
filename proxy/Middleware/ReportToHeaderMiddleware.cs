using System.Linq;
using System.Threading.Tasks;

using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;

using proxy.Configuration;

namespace proxy.Middleware
{
    public class ReportToHeaderMiddleware
    {
        private readonly RequestDelegate _next;

        public ReportToHeaderMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task Invoke(HttpContext ctx)
        {
            var cspSettings = ctx.RequestServices.GetRequiredService<IOptions<CspSettings>>();

            var reportUriEndpoints = string.Join(' ',
                cspSettings.Value.ReportTo.Select(x => string.Join(' ', x.Endpoints.Select(y => y.Url))));

            var contentSecurityPolicy =
                "default-src 'self'; " +
                "base-uri 'self'; " +
                "object-src 'none'; " +
                "script-src 'self' 'unsafe-eval'; " +
                "style-src 'self'; " +
                $"report-uri {reportUriEndpoints}";

            ctx.Response.Headers["Content-Security-Policy"] = contentSecurityPolicy;

            await _next(ctx);
        }
    }
}