using IXCheckCandidateApi.Globals;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Text;

namespace IXCheckCandidateApi.Models.Interfaces
{
    public interface ITemplateForm
    {
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.Layout)]
        public Layout Form { get; set; }
    }
}