using IXCheckCommonLib.Models.Paging;

namespace IXCheckCommonLib.Models.Interfaces
{
    public interface IPagination
    {
        PaginationParams GetPagingParams(HttpPaging _httpPaging);
    }
}
