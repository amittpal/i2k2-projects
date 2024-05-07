using IXCheckCommonLib.Models.Interfaces;
using System;
using System.Collections.Generic;
using System.Text;

namespace IXCheckCommonLib.Models
{
    public class MailAddress: IMailAddress
    {
        public MailAddress() { }
        public MailAddress(string _email, string _name)
        {
            Email = _email;
            Name = _name;
        }

        public string Email { get; set; }
        public string Name { get; set; }
    }
}
