using IXCheckCommonLib.Models.Interfaces;

namespace IXCheckCommonLib.Models.Paging
{
    public class Pagination : IPagination
    {
        public PaginationParams GetPagingParams(HttpPaging _httpPaging)
        {
            PaginationParams _paginationParams = new PaginationParams()
            {
                SortDirection = "DESC"
            };
            int _pageSize = 0;
            // set page size , default page size =10
            if (_httpPaging.PageSize == 0)
            {
                _paginationParams.PageSize = 10;
            }
            else
            {
                _paginationParams.PageSize = _httpPaging.PageSize;
            }

            //direction of paging NEXT = 0 , PREVIOUS = 1
            if (_httpPaging.Direction == 0)
            {
                if (_httpPaging.LastSeenIdMin > 0)
                {
                    _paginationParams.Direction = "<";   //we may need to  heck <= looks like for sequential id we may need <= but it will break non-sequestial
                    _paginationParams.OrderBy = "desc";
                }
                else
                {
                    // get first page record on page load
                    _paginationParams.Direction = ">";
                    _paginationParams.OrderBy = "desc";
                }
                //set last_id based on direction
                //for reverse direction last_id need to be MIN value of past page
                _paginationParams.LastSeenId = _httpPaging.LastSeenIdMin;
                // get last page records
                if (_httpPaging.LastOffset != 0)
                {
                    _paginationParams.LastSeenId = 0;
                    _paginationParams.Direction = ">";
                    _paginationParams.OrderBy = "asc";
                    _pageSize = _httpPaging.TotalRows % _httpPaging.PageSize;
                    if (_pageSize == 0)
                    {
                        _pageSize = _httpPaging.PageSize;
                    }
                    _paginationParams.PageSize = _pageSize;
                }
            }
            else
            {
                if (_httpPaging.LastSeenIdMin > 0)
                {
                    //set WHERE criteria direction
                    _paginationParams.Direction = ">";
                    _paginationParams.OrderBy = "asc";
                }
                else
                {
                    // get first page record when user move from any page to firtst page.
                    _paginationParams.Direction = ">";
                    _paginationParams.OrderBy = "desc";
                }

                //set last_id based on 
                //for forward direction last_id need to be MAX value of past page
                _paginationParams.LastSeenId = _httpPaging.LastSeenIdMax;
            }

            if (!string.IsNullOrEmpty(_httpPaging.SortExpression))
            {
                _paginationParams.SortExpression = _httpPaging.SortExpression;
            }
            if (!string.IsNullOrEmpty(_httpPaging.SortDirection))
            {
                _paginationParams.SortDirection = _httpPaging.SortDirection;
            }
            return _paginationParams;
        }
    }
}
