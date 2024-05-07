using IXCheckCandidateApi.Models;
using IXCheckCommonLib.Models.Interfaces;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace IXCheckCandidateApi.AppFunctions.Interfaces
{
    public interface IOpenRegistrationFunctions
    {

        Task<(ICoreUserInfo coreUserInfo, IFunctionReturn functionReturn)> AuthenticateUserAsync(string _username, string _password, string _examGuid,string _appGuid);
        Task<(string jsonReturn, IFunctionReturn functionReturn)> GetExamListAsync();
        Task<(string jsonReturn, IFunctionReturn functionReturn)> LayoutJsonByIdAsync(string _layoutType);
        Task<IFunctionReturn> CaptchaValidationAsync(CaptchaValidation _captchaValidation);
    }
}
