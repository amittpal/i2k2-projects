using IXCheckCandidateApi.Models;
using IXCheckCommonLib.Models.Interfaces;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace IXCheckCandidateApi.AppFunctions.Interfaces
{
    public interface IPaymentGatewayFunctions
    {
        public Task<(string jsonReturn, IFunctionReturn functionReturn)> GetPaymentInfoListListAsync(Payments _payments);
        public Task<(string jsonReturn, IFunctionReturn functionReturn)> GetPaymentStatusAsync(TimeSpan _cachecheckTime, string _candidateGuid, string _registrationsGuid);
        public Task<(string jsonReturn, IFunctionReturn functionReturn)> AddPaymentAsync(string _registrationGuid, string _candidateGuid);
        public Task<(string jsonReturn, IFunctionReturn functionReturn)> GetPaymentResponseListAsync(TimeSpan _cachecheckTime, string _candidateGuid);
        public Task<(string jsonReturn, IFunctionReturn functionReturn)> GetPaymentResponseIdAsync(TimeSpan _cachecheckTime, int _id);
        public Task<(string jsonReturn, IFunctionReturn functionReturn)> AddPAYTMPaymentResponseAsync(PaytmResponseDetail _paymentResponse);
        public Task<string> GetActivePaymentGatewayAsync();
        public Task<(string jsonReturn, IFunctionReturn functionReturn)> AddPAYUMONEYPaymentResponseAsync(PayUMoneyResponseDetail _paymentResponse);
        public Task<(string jsonReturn, IFunctionReturn functionReturn)> AddOfflinePaymentsGatewayAsync(OfflinePayments _payments, string _candidateGuid);
        public Task<(string jsonReturn, IFunctionReturn functionReturn)> AddRazorPayPaymentResponseAsync(RazorPayResponseDetail _paymentResponse);
    }
}