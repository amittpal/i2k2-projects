using IXCheckCandidateApi.Models;
using IXCheckCandidateApi.Models.HttpPost;
using IXCheckCommonLib.Models.Interfaces;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace IXCheckCandidateApi.AppFunctions.Interfaces
{
   public interface IFileAndDirFunctions
    {
        Task<(FileData fileData, IFunctionReturn functionReturn)> StreamFileChunkAsync(HttpFileParams _httpFileParams);
    }
}
