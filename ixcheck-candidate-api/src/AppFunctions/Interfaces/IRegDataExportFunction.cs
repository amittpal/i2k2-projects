using IXCheckCommonLib.Models.Interfaces;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace IXCheckCandidateApi.AppFunctions.Interfaces
{
    public interface IRegDataExportFunction
    {
        Task<(string jsonReturn, IFunctionReturn functionReturn)> ExportRegistrationsAsync(string _guid);
        public Task<(string jsonReturn, IFunctionReturn functionReturn)> ExportRegistrationDetailsAsync(string _examGuid);
    }
}