using System.Collections.Generic;

namespace proxy.Configuration
{
    public class ReportToGroup
    {
        public IEnumerable<ReportToEndpoint> Endpoints { get; set; }

        public string Group { get; set; }

        public int Max_Age { get; set; }
    }
}
