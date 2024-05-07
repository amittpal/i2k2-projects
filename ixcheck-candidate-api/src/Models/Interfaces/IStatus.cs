using System;
using IXCheckCandidateApi.Globals;
using Newtonsoft.Json;

namespace IXCheckCandidateApi.Models.Interfaces
{
	public interface IStatus
	{
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.Guid)]
        string Guid { get; set; }
    }

}
