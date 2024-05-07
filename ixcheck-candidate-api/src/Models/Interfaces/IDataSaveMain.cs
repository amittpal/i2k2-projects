using IXCheckCandidateApi.Globals;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Text;

namespace IXCheckCandidateApi.Models.Interfaces
{
    public interface IDataSaveMain
    {
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.CandidateGuid)]
        public string CandidateGuid { get; set; }

        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.DataSaveFormId)]
        public string FormId { get; set; }

        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.DataSavePageId)]
        public string PageId { get; set; }

        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.DataSaveSectionId)]
        public string SectionId { get; set; }


        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.DataSaveComponentId)]
        public string ComponentId { get; set; }

        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.DataSaveDataValue)]
        public string DataValue { get; set; }

        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.DataSaveImageValue)]
        public string ImageValue { get; set; }

        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.Status)]
        public string Status { get; set; }

        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.DataSaveShowinGrid)]
        public string ShowinGrid { get; set; }
    }
}
