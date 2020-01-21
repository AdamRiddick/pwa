using System.Collections.Generic;

namespace proxy.Configuration
{
    public class ApiSettings
    {
        public IEnumerable<ApiProxy> Proxies { get; set; }
    }
}
