using IXCheckCandidateApi.Models.Interfaces;
using System;
using System.Collections.Generic;
using System.Text;

namespace IXCheckCandidateApi.Models
{
    public class Condition : ICondition
    {
        public UInt64 ConditionId { get; set; }
        public string ConditionComponentId { get; set; }
        public string ConditionComponentGuid { get; set; }
        public string ConditionConditional { get; set; }
        public string ConditionStatus { get; set; }
        public string ConditionEventType { get; set; }
        public string ConditionChangeType { get; set; }
        public string ConditionComponentToChange { get; set; }
        public string ConditionsectionToShowHide { get; set; }
    }
}