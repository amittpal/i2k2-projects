using IXCheckCommonLib.Models.Interfaces;
using IXCheckCandidateApi.Models;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using IXCheckCandidateApi.Models.Interfaces;
using static IXCheckCandidateApi.Globals.ApplicationConstants;

namespace IXCheckCandidateApi.AppFunctions.Interfaces
{
    public interface ISharedFunctions
    {
        Task<(string jsonReturn, IFunctionReturn functionReturn)> GetStateListAsync();

        Task<(string jsonReturn, IFunctionReturn functionReturn)> GetStateListByCountryIdAsync(int _id);

        Task<(string jsonReturn, IFunctionReturn functionReturn)> GetDistrictListByStateIdAsync(int _id);

        Task<(string jsonReturn, IFunctionReturn functionReturn)> GetCityListByDistrictIdAsync(int _id);

        Task<(string jsonReturn, IFunctionReturn functionReturn)> GetCityListByStateIdAsync(int _id);
        public Task<(string jsonReturn, IFunctionReturn functionReturn)> GetCityListPriorityAsync(string _registrationGuid);
        Task<(string jsonReturn, IFunctionReturn functionReturn)> GetCountryListAsync();

        Task<(string jsonReturn, IFunctionReturn functionReturn)> GetCityListAsync(int _stateid);
        Task<(string jsonReturn, IFunctionReturn functionReturn)> GetCategoryListAsync();
        Task<(string jsonReturn, IFunctionReturn functionReturn)> GetGenderListAsync();
        Task<(string jsonReturn, IFunctionReturn functionReturn)> GetSpecialCategoryListAsync();
        Task<(string jsonReturn, IFunctionReturn functionReturn)> GetTitleListAsync();
        Task<(string jsonReturn, IFunctionReturn functionReturn)> GetPostListAsync();
        Task<(string jsonReturn, IFunctionReturn functionReturn)> GetQualificationListAsync();

        Task<(string jsonReturn, IFunctionReturn functionReturn)> GetIdProofListAsync();
        Task<(string jsonReturn, IFunctionReturn functionReturn)> GetRelationListAsync();
        Task<(string jsonReturn, IFunctionReturn functionReturn)> GetReligionListAsync();

        Task<(string jsonReturn, IFunctionReturn functionReturn)> GetCourseListAsync();
        Task<(string jsonReturn, IFunctionReturn functionReturn)> GetNationalityListAsync();

        Task<(string jsonReturn, IFunctionReturn functionReturn)> GetBoardListAsync();
        Task<(string jsonReturn, IFunctionReturn functionReturn)> GetUniversityListAsync();
        Task<(string jsonReturn, IFunctionReturn functionReturn)> GetStreamListAsync();
        Task<(string jsonReturn, IFunctionReturn functionReturn)> GetMartialStatusListAsync();
        Task<(string jsonReturn, IFunctionReturn functionReturn)> GetExamMediumListAsync();
        public Task<(string jsonReturn, IFunctionReturn functionReturn)> ValidateUniqueComponentAsync(ValidateComponent validateComponent);
        Task<(string jsonReturn, IFunctionReturn)> GetCaptchaAsync(UInt64 _captchaId);
        public Task<IFunctionReturn> ValidateCityComponentAsync(IValidateComponent _validateComponent);
        Task<(string jsonReturn, IFunctionReturn functionReturn)> GetRegTypeListAsync(string _regGuid);
        public IFunctionReturn LogCandidateActivityAsync(string _candidateGuid,int _activityTypeId, string _logDescription);
        public Task<(string jsonReturn, IFunctionReturn functionReturn)> GetCertificateIssuingAuthorityAsync();
        public Task<(string jsonReturn, IFunctionReturn functionReturn)> GetCertificateIssuingDistrictAsync();

        Task<(string jsonReturn, IFunctionReturn functionReturn)> AiValidationsAsync(AiImageValidation _aiImageValidation);
        Task<(string jsonReturn, IFunctionReturn functionReturn)> AnalyzePhotosAsync(AiImageValidation _aiImageValidation);
        Task<(string jsonReturn, IFunctionReturn functionReturn)> AiValidateImageAsync(AiImageValidation _aiImageValidation);

        public Task<(string jsonReturn, IFunctionReturn functionReturn)> GetDegreeListAsync(string _qualificationtypeGuid);
        public Task<(string jsonReturn, IFunctionReturn functionReturn)> GetUniversityListAsync(string _stateGuid);
        public Task<(string jsonReturn, IFunctionReturn functionReturn)> GetStreamListByDegreeAsync(string _degreeGuid);
        public Task<(string jsonReturn, IFunctionReturn functionReturn)> GetMarksTypeListAsync();
        public Task<(string jsonReturn, IFunctionReturn functionReturn)> GetGradeListAsync();
        public Task<(string jsonReturn, IFunctionReturn functionReturn)> GetQualificationTypeAsync();
        public Task<(string jsonReturn, IFunctionReturn functionReturn)> DOBDifferenceAsync(DateTime? _dob);
    }
}