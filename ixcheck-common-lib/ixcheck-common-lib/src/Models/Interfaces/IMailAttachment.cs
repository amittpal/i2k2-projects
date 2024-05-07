using IXCheckCommonLib.Globals;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Text;

namespace IXCheckCommonLib.Models.Interfaces
{
    public interface IMailAttachment
    {
        [JsonProperty(PropertyName = JsonReturnConstants.PropertyNames.MailAttachmentPath)]
        string Path { get; set; }
        [JsonProperty(PropertyName = JsonReturnConstants.PropertyNames.FileName)]
        string FileName { get; set; }
        [JsonProperty(PropertyName = JsonReturnConstants.PropertyNames.Content)]
        string Content { get; set; }
        [JsonProperty(PropertyName = JsonReturnConstants.PropertyNames.FileType)]
        string FileType { get; set; }
    }
}
