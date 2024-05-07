namespace IXCheckCommonLib.Models.Interfaces
{
    public interface IApiDetails
    {
        string Title { get; set; }
        string Url { get; set; }
        string Version { get; set; }
        string PublishedDate { get; set; }
        string Description { get; set; }
    }
}
