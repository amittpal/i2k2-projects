using IXCheckCommonLib.Models.Interfaces;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace IXCheckCandidateApi.AppFunctions.Interfaces
{
    public interface IAssignmentFunctions
    {
        /// <summary>
        /// Get Exam via http request
        /// </summary>
        /// <param name="sdsdsd"></param>
        /// <param name=""></param>
        /// <returns>(string jsonReturn, IFunctionReturn functionReturn)</returns>
        Task<(string jsonReturn, IFunctionReturn functionReturn)> GetRegistrationLinkAsync();
    }
}
