using IXCheckCandidateApi.Globals;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IXCheckCandidateApi.Models.Interfaces
{
    public interface IEligibiltyDetail
    {
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.ExamEligibiltiy)]
        public ExamEligibiltiy ExamEligibiltiy { get; set; }
    }


    public interface IEducation
    {
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.QualificationTypeName)]
        public string QualificationTypeName { get; set; }
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.QualificationTypeGuid)]
        public string QualificationTypeGuid { get; set; }
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.DegreeName)]
        public string DegreeName { get; set; }
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.DegreeGuid)]
        public string DegreeGuid { get; set; }
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.Percentage)]
        public string Percentage { get; set; }
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.Grade)]
        public string Grade { get; set; }
    }

    public interface IEligibiltiyCriteria
    {
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.CategoryName)]
        public string CategoryName { get; set; }
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.CategoryGuid)]
        public string CategoryGuid { get; set; }
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.Ph)]
        public string Ph { get; set; }
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.Education)]
        public List<Education> Education { get; set; }
    }

    public interface IExam
    {
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.ExamName)]
        public string ExamName { get; set; }
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.ExamGuid)]
        public string ExamGuid { get; set; }
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.EligibilityCriteria)]
        public List<EligibiltiyCriteria> EligibilityCriteria { get; set; }
    }

    public interface IExamEligibiltiy
    {
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.RegistrationGuid)]
        public string RegistrationGuid { get; set; }
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.Exams)]
        public List<Exam> Exams { get; set; }
    }
}
