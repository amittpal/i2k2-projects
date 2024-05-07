using IXCheckCandidateApi.Models.Interfaces;
using System;
using System.Collections.Generic;
using System.Text;

namespace IXCheckCandidateApi.Models
{
    public class Exams : IExams
    {
        public string Id { get; set; }
        public string ExamTypeGuid { get; set; }
        public string ExamType { get; set; }
        public string ExamGuid { get; set; }
        public string ExamNumber { get; set; }
        public string ExamCode { get; set; }
        public string ExamName { get; set; }
        public string ExamDuration { get; set; }
        public string PlanningStatusGuid { get; set; }
        public string DurationUOMGuid { get; set; }
        public string ExamNumberOfShifts { get; set; }
        public bool Status { get; set; }
        public string NoOfCityPriority { get; set; }
    }
}