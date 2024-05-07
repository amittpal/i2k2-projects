using IXCheckCommonLib.Globals;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Text;

namespace IXCheckCommonLib.Models.Interfaces
{
    public interface IEmailParams
    {
        [JsonProperty(PropertyName = JsonReturnConstants.PropertyNames.MailFrom)]
        MailAddress MailFrom { get; set; }
        [JsonProperty(PropertyName = JsonReturnConstants.PropertyNames.MailTo)]
        List<MailAddress> MailTo { get; set; }
        [JsonProperty(PropertyName = JsonReturnConstants.PropertyNames.MailCc)]
        List<MailAddress> MailCc { get; set; }
        [JsonProperty(PropertyName = JsonReturnConstants.PropertyNames.MailBcc)]
        List<MailAddress> MailBcc { get; set; }
        [JsonProperty(PropertyName = JsonReturnConstants.PropertyNames.MailSubject)]
        string MailSubject { get; set; }
        [JsonProperty(PropertyName = JsonReturnConstants.PropertyNames.MailBody)]
        string MailBody { get; set; }
        [JsonProperty(PropertyName = JsonReturnConstants.PropertyNames.IsHtml)]
        bool IsHtml { get; set; }
        [JsonProperty(PropertyName = JsonReturnConstants.PropertyNames.MailAttachment)]
        List<MailAttachment> MailAttachment { get; set; }

        [JsonProperty(PropertyName = JsonReturnConstants.PropertyNames.MailJobType)]
        Enumeration.MailJobTypeEnum MailJobType { get; set; }
    }
}
