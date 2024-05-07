using System;
using System.Collections.Generic;
using System.Text;

namespace IXCheckCandidateApi.Models.Interfaces
{
    public interface IPaymentSettings
    {
        string AuthNetAPIUrl { get; set; }
        string KeyName { get; set; }
        string TransactionKey { get; set; }
        string ValidationMode { get; set; }
        string MerchantKey { get; set; }
        string Mid { get; set; }
        string CallBackUrl { get; set; }
        string WebSite { get; set; }
        string IndustryType { get; set; }
        string ChannelId { get; set; }
        string AppUrl { get; set; }
        //string GoBackUrl { get; set; }
    }
}