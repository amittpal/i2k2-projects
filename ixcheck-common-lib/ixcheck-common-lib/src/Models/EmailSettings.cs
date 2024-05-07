using IXCheckCommonLib.Models.Interfaces;
using System;
using System.Collections.Generic;
using System.Text;

namespace IXCheckCommonLib.Models
{
    public class EmailSettings: IEmailSettings
    {
        public string ConfigTypeName { get; set; }
        public string SendGridAPIKey { get; set; }
        public string MailServer { get; set; }
        public int PortNumber { get; set; }
        public string FromEmail { get; set; }
        public string FromEmailName { get; set; }
        public string Username { get; set; }
        public string Password { get; set; }
        public string AdminServerURL { get; set; }
        public string TechServerURL { get; set; }
        public string PlainTextContent { get; set; }

        public string DistributorAppURL { get; set; }
        public string ResellerAppURL { get; set; }
        public string EndCustomerAppURL { get; set; }
    }
}
