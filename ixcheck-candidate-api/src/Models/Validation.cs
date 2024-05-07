using IXCheckCandidateApi.Models.Interfaces;
using System;
using System.Collections.Generic;
using System.Text;

namespace IXCheckCandidateApi.Models
{
    public class Validation : IValidation
    {
        public UInt64 ValidationId { get ; set ; }
        public string ValidationRequired { get ; set ; }
        public string ValidationMaxLength { get ; set ; }
        public string ValidationMinLength { get ; set ; }
        public string ValidationRegex { get ; set ; }
        public string ValidationErrorMessage { get ; set ; }
        public string ValidationMinDate { get ; set ; }
        public string ValidationMaxDate { get ; set ; }
        public string ValidationStatus { get ; set ; }
        public string ValidationUnique { get ; set ; }
        public string ValidationUniqueURL { get ; set ; }
        public string ValidationAllowedExtentions { get ; set ; }
        public string ValidationAllowedSize { get ; set ; }
        public string ValidationMinHeight { get ; set ; }
        public string ValidationMinWidth { get ; set ; }
        public string ValidationMaxHeight { get ; set ; }
        public string ValidationMaxWidth { get ; set ; }
        public string ValidationAllowedFileCount { get ; set ; }
        public string ValidationOtpVerification { get ; set ; }
    }
}