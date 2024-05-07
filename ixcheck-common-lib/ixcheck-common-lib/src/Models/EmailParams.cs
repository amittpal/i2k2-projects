using IXCheckCommonLib.Globals;
using IXCheckCommonLib.Models.Interfaces;
using System;
using System.Collections.Generic;
using System.Text;

namespace IXCheckCommonLib.Models
{
    public class EmailParams: IEmailParams
    {
        public EmailParams()
        {
            MailFrom = new MailAddress();
            MailTo = new List<MailAddress>();
            MailCc = new List<MailAddress>();
            MailBcc = new List<MailAddress>();
            MailSubject = "";
            MailBody = "";
            MailAttachment = new List<MailAttachment>();
            IsHtml = true;
        }

        public MailAddress MailFrom { get; set; }
        public List<MailAddress> MailTo { get; set; }
        public List<MailAddress> MailCc { get; set; }
        public List<MailAddress> MailBcc { get; set; }
        public string MailSubject { get; set; }
        public string MailBody { get; set; }
        public bool IsHtml { get; set; }
        public List<MailAttachment> MailAttachment { get; set; }
        public Enumeration.MailJobTypeEnum MailJobType { get; set; }
    }
}
