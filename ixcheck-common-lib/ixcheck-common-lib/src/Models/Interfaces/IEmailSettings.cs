using System;
using System.Collections.Generic;
using System.Text;

namespace IXCheckCommonLib.Models.Interfaces
{
    public interface IEmailSettings
    {
        string ConfigTypeName { get; set; }
        string SendGridAPIKey { get; set; }
        string MailServer { get; set; }
        int PortNumber { get; set; }
        string FromEmail { get; set; }
        string FromEmailName { get; set; }
        string Username { get; set; }
        string Password { get; set; }
        string AdminServerURL { get; set; }
        string TechServerURL { get; set; }
        string PlainTextContent { get; set; }
        string DistributorAppURL { get; set; }
        string ResellerAppURL { get; set; }
        string EndCustomerAppURL { get; set; }
    }
}
