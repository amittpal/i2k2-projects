using IXCheckCandidateApi.Models.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IXCheckCandidateApi.Models
{
    public class RazorpayRequestDetail : IRazorpayRequestDetail
    {
        public string OrderId { get; set; }
        public string RegistrationsGuid { get; set; }
        public string CandidateGuid { get; set; }
        public string Email { get; set; }
        public string Name { get; set; }
        public string MobileNumber { get; set; }
        public string FeeAmount { get; set; }
        public string RequestDateTime { get; set; }
        public string ProductInfo { get; set; }
        public string PaymentGatewayId { get; set; }
        public string CheckSumHash { get; set; }
        public string TxnStatus { get; set; }
        public string Status { get; set; }
        public string RazorPayOrderId { get; set; }
        public RazorPayResponseDetail RazorPayResponseDetail { get; set; }
    }
}