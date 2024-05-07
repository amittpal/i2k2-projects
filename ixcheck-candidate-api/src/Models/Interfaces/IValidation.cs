using IXCheckCandidateApi.Globals;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Text;

namespace IXCheckCandidateApi.Models.Interfaces
{
   public interface IValidation
    {
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.ValidationId)]
        public UInt64 ValidationId { get; set; }
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.ValidationRequired)]
        public string ValidationRequired { get; set; }
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.ValidationMaxLength)]
        public string ValidationMaxLength { get; set; }
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.ValidationMinLength)]
        public string ValidationMinLength { get; set; }
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.ValidationRegex)]
        public string ValidationRegex { get; set; }
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.ValidationErrorMessage)]
        public string ValidationErrorMessage { get; set; }
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.ValidationMinDate)]
        public string ValidationMinDate { get; set; }
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.ValidationMaxDate)]
        public string ValidationMaxDate { get; set; }

        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.ValidationStatus)]
        public string ValidationStatus { get; set; }
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.ValidationUnique)]
        public string ValidationUnique { get; set; }
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.ValidationUniqueURL)]
        public string ValidationUniqueURL { get; set; }

        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.ValidationAllowedExtentions)]
        public string ValidationAllowedExtentions { get; set; }
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.ValidationAllowedSize)]
        public string ValidationAllowedSize { get; set; }

        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.ValidationMinHeight)]
        public string ValidationMinHeight { get; set; }
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.ValidationMinWidth)]
        public string ValidationMinWidth { get; set; }

        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.ValidationMaxHeight)]
        public string ValidationMaxHeight { get; set; }
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.ValidationMaxWidth)]
        public string ValidationMaxWidth { get; set; }
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.ValidationAllowedFileCount)]
        public string ValidationAllowedFileCount { get; set; }

        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.ValidationOTP)]
        public string ValidationOtpVerification { get; set; }
    }
}