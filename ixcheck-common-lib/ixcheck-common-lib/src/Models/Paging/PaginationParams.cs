using IXCheckCommonLib.Models.Interfaces;

namespace IXCheckCommonLib.Models.Paging
{
    public class PaginationParams : IPaginationParams
    {
        public PaginationParams()
        {
            //Initialize properties to default values - very important
            LastSeenIdMax = 0;
            LastSeenIdMin = 0;
            LastSeenId = 0;
            TotalRows = 0;
            LastOffset = 0;
            PageSize = 0;
            SortBy = "id";
            SortOrderDirection = "asc";
            Direction = "";
            PageNumber = 0;
            SortExpression = "";
            OrderBy = "";
            SortDirectionInner = "";
        }

        //Paging Params
        public int LastSeenIdMax { get; set; }
        public int LastSeenIdMin { get; set; }
        public int LastSeenId { get; set; }
        public int TotalRows { get; set; }
        public int LastOffset { get; set; }
        public int OffSet { get; set; }
        public int PageSize { get; set; }
        public string SortBy { get; set; }
        public string SortOrderDirection { get; set; }
        public string Direction { get; set; }
        public int PageNumber { get; set; }
        public string SortExpression { get; set; }
        public string SortDirection { get; set; }
        public string SortDirectionInner { get; set; }
        public string OrderBy { get; set; }
    }
}
