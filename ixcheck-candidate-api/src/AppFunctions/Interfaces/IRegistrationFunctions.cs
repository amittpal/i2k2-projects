using IXCheckCandidateApi.Models;
using IXCheckCommonLib.Models.Interfaces;
using IxcheckRegApi.Models;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace IXCheckCandidateApi.AppFunctions.Interfaces
{
    public interface IRegistrationFunctions
    {
        public Task<(string jsonReturn, IFunctionReturn functionReturn)> AddLayoutJsonAsync(TemplateForm _templateForm);
        public Task<(string jsonReturn, IFunctionReturn functionReturn)> AddLayoutJsonValueAsync(TemplateList _templateFormValue);
        public Task<(string jsonReturn, IFunctionReturn functionReturn)> EditLayoutJsonAsync(TemplateForm _templateForm);
        public Task<(string jsonReturn, IFunctionReturn functionReturn)> LayoutJsonByIdAsync(UInt64 _id);
        public Task<IFunctionReturn> ValidateOTPAsync(ValidationOTP _validationOTP);
        public Task<IFunctionReturn> GenerateOTPAsync(ValidationOTP _validationOTP);
        public Task<(string jsonReturn, IFunctionReturn functionReturn)> CandidateJsonByGuidAsync(string _candidateGuid);
        public Task<(string jsonReturn, IFunctionReturn functionReturn)> CandidateInitialInfoByIdAsync(string _guid);
        public Task<IFunctionReturn> RegistrationSubmitAsync(RegistrationData _registrationData);
        public Task<IFunctionReturn> UpdateEmailAsync(RegistrationData _registrationData);
        public Task<IFunctionReturn> ChangeCustomerUserPasswordAsync(CustomerUser _customerUser);
        public Task<IFunctionReturn> ResetUserPasswordEmailAsync(string _userName,string _candidateGuid);
        public Task<(string jsonReturn, IFunctionReturn functionReturn)> AddRegGridComponentValueAsync(RegGridComponentValues _regGridComponentList);
        public Task<(string jsonReturn, IFunctionReturn functionReturn)> DeleteRegGridComponentValueAsync(RegGridComponent _regGridComponent);
        public Task<(string jsonReturn, IFunctionReturn functionReturn)> RegGridComponentListAsync(string _candidateGuid);
        Task<(string jsonReturn, IFunctionReturn functionReturn)> LayoutComponentListAsync(string _candidateGuid, UInt64 _id);
        public Task<(string jsonReturn, IFunctionReturn functionReturn)> RegGridComponentViewListAsync(string _candidateGuid);
        public Task<(string jsonReturn, IFunctionReturn functionReturn)> GetCandidateEligibilityAsync(string _candidateGuid);
        public Task<(string jsonReturn, IFunctionReturn functionReturn)> SaveExamEligibilityCriteriaAsync(string _candidateGuid, string _registrationGuid);
    }
}