using IXCheckCommonLib.Globals;
using System;
using System.Collections.Generic;
using System.Text;

namespace IXCheckCommonLib.Models.Interfaces
{
    public interface IHttpClientRequestParam
    {
        Enumeration.RequestType Type { get; set; }
        string AccessToken { get; set; }
        Uri Uri { get; set; }

        string Json { get; set; }

        List<KeyValuePair<string, string>> HeaderValues { get; set; }

        List<KeyValuePair<string, string>> FormValues { get; set; }

        TimeSpan Timeout { get; set; }
    }
}
