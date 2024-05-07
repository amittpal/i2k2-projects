using IXCheckCommonLib.Globals;
using Newtonsoft.Json;

namespace IXCheckCommonLib.Models.Interfaces
{
    public interface IHttpPaging
    {
        //Paging Params
        [JsonProperty(PropertyName = JsonReturnConstants.PropertyNames.LastSeenIdMax)]
        int LastSeenIdMax { get; set; }
        [JsonProperty(PropertyName = JsonReturnConstants.PropertyNames.LastSeenIdMin)]
        int LastSeenIdMin { get; set; }
        [JsonProperty(PropertyName = JsonReturnConstants.PropertyNames.LastOffset)]
        int LastOffset { get; set; }
        [JsonProperty(PropertyName = JsonReturnConstants.PropertyNames.PageSize)]
        int PageSize { get; set; }
        [JsonProperty(PropertyName = JsonReturnConstants.PropertyNames.SortBy)]
        string SortBy { get; set; }
        [JsonProperty(PropertyName = JsonReturnConstants.PropertyNames.SortOrderDirection)]
        string SortOrderDirection { get; set; }
        [JsonProperty(PropertyName = JsonReturnConstants.PropertyNames.Direction)]
        int Direction { get; set; }
        [JsonProperty(PropertyName = JsonReturnConstants.PropertyNames.PageNumber)]
        int PageNumber { get; set; }
        [JsonProperty(PropertyName = JsonReturnConstants.PropertyNames.SortExpression)]
        string SortExpression { get; set; }
        [JsonProperty(PropertyName = JsonReturnConstants.PropertyNames.SortDirection)]
        string SortDirection { get; set; }
        [JsonProperty(PropertyName = JsonReturnConstants.PropertyNames.TotalRows)]
        int TotalRows { get; set; }
    }
}
