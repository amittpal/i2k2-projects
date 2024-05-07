using IXCheckCommonLib.Globals;
using IXCheckCommonLib.Models.Interfaces;
using System;
using System.Collections.Generic;
using System.Text;

namespace IXCheckCommonLib.Models
{
    public class HttpClientRequestParam : IHttpClientRequestParam
    {
        public Enumeration.RequestType Type {get; set;}
        public string AccessToken { get; set; }
        public Uri Uri { get; set; }

        public string Json { get; set; }

        public List<KeyValuePair<string, string>> HeaderValues { get; set; }

        public List<KeyValuePair<string, string>> FormValues { get; set; }

        public TimeSpan Timeout { get; set; }
    }
}
