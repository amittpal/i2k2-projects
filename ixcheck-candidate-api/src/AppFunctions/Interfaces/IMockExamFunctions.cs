using IXCheckCommonLib.Models.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IXCheckCandidateApi.AppFunctions.Interfaces
{
    public interface IMockExamFunctions
    {
        public Task<(string jsonReturn, IFunctionReturn functionReturn)> GetMockExamVistaDBAsync();
    }
}