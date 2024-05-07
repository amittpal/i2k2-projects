using IXCheckCandidateApi.Models.Interfaces;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IXCheckCandidateApi.Models
{
    class EligibiltyDetail : IEligibiltyDetail
    {
        public ExamEligibiltiy ExamEligibiltiy { get; set; }
    }


    public class Education : IEducation
    {
        public string QualificationTypeName { get; set; }      
        public string QualificationTypeGuid { get; set; }     
        public string DegreeName { get; set; }       
        public string DegreeGuid { get; set; }       
        public string Percentage { get; set; }
        public string Grade { get; set; }
    }

    public class EligibiltiyCriteria: IEligibiltiyCriteria
    {      
        public string CategoryName { get; set; }      
        public string CategoryGuid { get; set; }    
        public string Ph { get; set; }      
        public List<Education> Education { get; set; }
    }

    public class Exam : IExam
    {
       
        public string ExamName { get; set; }       
        public string ExamGuid { get; set; }       
        public List<EligibiltiyCriteria> EligibilityCriteria { get; set; }
    }

    public class ExamEligibiltiy: IExamEligibiltiy
    {
        public string RegistrationGuid { get; set; }
        public List<Exam> Exams { get; set; }
    }

    //public class Root
    //{
    //    public ExamEligibiltiy exam_eligibiltiy { get; set; }
    //}

    public class QualifyExamEligibiltiy 
    {

        public string ExamName { get; set; }
        public string ExamGuid { get; set; }
        public bool Status { get; set; }
       
    }
}
