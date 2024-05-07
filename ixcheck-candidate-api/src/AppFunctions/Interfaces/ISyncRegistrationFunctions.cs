using IXCheckCandidateApi.Models;
using IXCheckCommonLib.Models.Interfaces;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace IXCheckCandidateApi.AppFunctions.Interfaces
{
    public interface ISyncRegistrationFunctions
    {
        Task<(string jsonReturn, IFunctionReturn functionReturn)> CreateRegistrationDataAsync(SyncRegistration _syncRegistration );
    }
}
