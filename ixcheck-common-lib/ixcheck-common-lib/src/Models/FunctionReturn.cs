using IXCheckCommonLib.Models.Interfaces;
using System.Collections.Generic;

namespace IXCheckCommonLib.Models
{
    public class FunctionReturn : IFunctionReturn
    {
        public FunctionReturn()
        {
            Status = true;
            MessageType = string.Empty;
            Message = new List<string>();
            HttpStatusCode = "200";
            MethodName = "";
        }
        public bool Status { get; set; }
        public string MessageType { get; set; }
        public List<string> Message { get; set; }
        public string HttpStatusCode { get; set; }
        public string MethodName { get; set; }
    }
}
