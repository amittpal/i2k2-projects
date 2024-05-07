using IXCheckCommonLib.Models.Interfaces;

namespace IXCheckCommonLib.Models.Paging
{
    public class HttpPaging : IHttpPaging
    {
        public HttpPaging()
        {
            LastSeenIdMax = 0;
            LastSeenIdMin = 0;
            LastOffset = 0;
            PageSize = 0;
            SortBy = "id";
            SortOrderDirection = "asc";
            Direction = 0;
            PageNumber = 0;
            SortExpression = "";
            SortDirection = "";
            TotalRows = 0;
        }
        //Paging Params
        public int LastSeenIdMax { get; set; }
        public int LastSeenIdMin { get; set; }
        public int LastOffset { get; set; }
        public int PageSize { get; set; }
        public string SortBy { get; set; }
        public string SortOrderDirection { get; set; }
        public int Direction { get; set; }
        public int PageNumber { get; set; }
        public string SortExpression { get; set; }
        public string SortDirection { get; set; }
        public int TotalRows { get; set; }
    }
}
