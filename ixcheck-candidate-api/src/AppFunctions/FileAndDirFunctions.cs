using IXCheckCandidateApi.AppFunctions.Interfaces;
using IXCheckCandidateApi.Models;
using IXCheckCandidateApi.Models.HttpPost;
using IXCheckCommonLib.AppFunctions.Interfaces;
using IXCheckCommonLib.AppValidations;
using IXCheckCommonLib.Globals;
using IXCheckCommonLib.Models;
using IXCheckCommonLib.Models.Interfaces;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.IO;
using System.Text;
using System.Threading.Tasks;

namespace IXCheckCandidateApi.AppFunctions
{
    public class FileAndDirFunctions : IFileAndDirFunctions
    {

        private IFunctionReturn _functionReturn = null;
        
        private readonly ILoggerFunctions _loggerFunctions;
        private readonly IApiResponse _apiResponse;
        private readonly IConfiguration _configuration;


        public FileAndDirFunctions(ILoggerFunctions __loggerFunctions,
                                    IApiResponse __apiResponse, IConfiguration __configuration)
        {
       
            _apiResponse = __apiResponse;
            _loggerFunctions = __loggerFunctions;
            _configuration = __configuration;


        }



        public Task<(FileData fileData, IFunctionReturn functionReturn)> StreamFileChunkAsync(HttpFileParams _httpFileParams)
        {
            return Task.Run(() => StreamFileChunk(_httpFileParams));
        }

        private (FileData fileData, IFunctionReturn functionReturn) StreamFileChunk(HttpFileParams _httpFileParams)
        {
            string _methodName = "StreamFile";
            CommonFunctions.Log(Enumeration.LogLevel.Information, _loggerFunctions, "File Stream Started", _methodName);
            FileData _fileData = new FileData();

            string _destPathEcoBack = _httpFileParams.DestinationPath;
            string _dirRoot = _httpFileParams.DirectoryRoot;
            string _folderPath = _httpFileParams.FolderPath;
            string _fileName = _httpFileParams.FileName;
            string _file_path = "";

           
            _functionReturn = new FunctionReturn();
            string _jsonReturn = string.Empty;

            if (!string.IsNullOrEmpty(_fileName))
            {
                try
                {
                    // Concatenate the domain with the Web resource filename.
                    _fileData.FilePath = _destPathEcoBack;
                    _fileData.Name = _fileName;
                    _file_path = _configuration["ApiSettings:FilePath"] +"/"+ _fileName;
                    byte[] _byte = GetFileStreamChunk(_file_path, _httpFileParams.Offset, _httpFileParams.Count);
                    _fileData.Data = _byte;
                    if (_byte == null)
                    {
                        _fileData.Status = false;
                    }
                    else
                    {
                        _fileData.Status = true;
                    }
                    _functionReturn.Status = true;
                }
                catch (Exception ex)
                {
                    _functionReturn = new FunctionReturn();
                    _fileData.Status = true;
                    //No Data // Need to send blank JSON object instead of error
                    _functionReturn.Status = false;
                    _functionReturn.MessageType = Constants.ReturnMessageTypes.AppError;
                    _functionReturn.Message.Add(ex.Message);
                    _functionReturn.HttpStatusCode = Constants.HttpStatusCodes.Unauthorized;
                    CommonFunctions.Log(Enumeration.LogLevel.Error, _loggerFunctions, ex.Message, _methodName);
                }
            }
            else
            {
                _fileData.FilePath = _destPathEcoBack;
                _fileData.Name = _fileName;
                _fileData.Status = true;
                _functionReturn.Status = true;
            }
            CommonFunctions.Log(Enumeration.LogLevel.Information, _loggerFunctions, "File Stream Ended", _methodName);
            return (_fileData, _functionReturn);
        }


        private byte[] GetFileStreamChunk(string _filePath, int _offset, int _count)
        {
            string _methodName = "GetFileStreamChunk";
            CommonFunctions.Log(Enumeration.LogLevel.Information, _loggerFunctions, "Get File Stream Started", _methodName);
            if (!CommonFunctions.IsFileReady(_filePath))
            {
                CommonFunctions.Log(Enumeration.LogLevel.Information, _loggerFunctions, "File Stream data is NULL", _methodName);
                return null;
            }
            using (FileStream fs = new FileStream(_filePath, FileMode.Open, FileAccess.Read))
            {
                int _chunkSize = _count; //2MB
                // Create a byte array of file stream length
                // byte[] bytes = System.IO.File.ReadAllBytes(_filePath);               
                byte[] bytes = new byte[_chunkSize];

                // byte[] _dataBuffer = new byte[_chunkSize];
                // fs.Seek(0, SeekOrigin.Begin);
                //read the first chunk into _dataBuffer
                // int bytesRead = fs.Read(_dataBuffer, 0, _chunkSize);

                //***************************************************
                //Potential memory problem can occur as we are reading the WHOLE file in memory
                //***************************************************

                //Read block of bytes from stream into the byte array
                //fs.Read(bytes, 0, System.Convert.ToInt32(fs.Length));
                fs.Seek(_offset, SeekOrigin.Begin);
                fs.Read(bytes, 0, _chunkSize);

                //Close the File Stream
                fs.Close();
                fs.Dispose();

                CommonFunctions.Log(Enumeration.LogLevel.Information, _loggerFunctions, "Get File Stream Ended", _methodName);
                return bytes; //return the byte data
            }
        }



    }
}
