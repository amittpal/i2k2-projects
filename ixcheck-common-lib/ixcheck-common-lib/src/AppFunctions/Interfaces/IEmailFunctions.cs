using IXCheckCommonLib.Models.Interfaces;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace IXCheckCommonLib.AppFunctions.Interfaces
{
    public interface IEmailFunctions
    {
        Task<bool> SendMailAsync(IEmailParams _emailParams, IEmailSettings _emailSettings);
        Task<bool> SendMailAsync(IEmailParams _emailParams);
    }
}
