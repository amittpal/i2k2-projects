using IXCheckCommonLib.Models.Interfaces;
using System;
using System.Collections.Generic;
using System.Text;

namespace IXCheckCommonLib.Models
{
    public class ApiDetails : IApiDetails
    {
        public string Title { get; set; }
        public string Url { get; set; }
        public string Version { get; set; }
        public string PublishedDate { get; set; }
        public string Description { get; set; }
    }
}
