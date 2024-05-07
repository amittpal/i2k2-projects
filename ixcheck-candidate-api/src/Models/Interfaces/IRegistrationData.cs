using IXCheckCandidateApi.Globals;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Text;

namespace IXCheckCandidateApi.Models.Interfaces
{
    public interface IRegistrationData
    {
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.Id)]
        public string Id { get; set; }

        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.RegistrationGuid)]
        public string RegistrationGuid { get; set; }

        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.RegCode)]
        public string RegCode { get; set; }

        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.CandidateGuid)]
        public string CandidateGuid { get; set; }


        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.FirstName)]
        public string FirstName { get; set; }

        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.LastName)]
        public string LastName { get; set; }

        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.FatherName)]
        public string FatherName { get; set; }

        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.Dob)]
        public string Dob { get; set; }

        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.MobileNumber)]
        public string MobileNumber { get; set; }

        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.EmailId)]
        public string EmailId { get; set; }

        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.Photo)]
        public string Photo { get; set; }

        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.Signature)]
        public string Signature { get; set; }

        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.GenderGuid)]
        public string GenderGuid { get; set; }

        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.Gender)]
        public string Gender { get; set; }


        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.CategoryGuid)]
        public string CategoryGuid { get; set; }

        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.Category)]
        public string Category { get; set; }

        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.Ph)]
        public string Ph { get; set; }
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.SC)]
        public string SC { get; set; }

        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.ST)]
        public string ST { get; set; }

        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.Obc)]
        public string OBC { get; set; }

        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.General)]
        public string General { get; set; }


        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.Pc1Guid)]
        public string Pc1Guid { get; set; }

        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.Pc1)]
        public string PC1 { get; set; }

        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.Pc2Guid)]
        public string Pc2Guid { get; set; }

        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.Pc2)]
        public string PC2 { get; set; }

        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.Pc3Guid)]
        public string Pc3Guid { get; set; }

        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.Pc3)]
        public string PC3 { get; set; }

        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.AdmitCardId)]
        public string AdmitCardId { get; set; }
    }
}