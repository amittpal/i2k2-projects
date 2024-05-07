using IXCheckCandidateApi.Globals;
using IXCheckCommonLib.AppFunctions.Interfaces;
using IXCheckCommonLib.AppValidations;
using IXCheckCommonLib.Globals;
using IXCheckCommonLib.Models;
using IXCheckCommonLib.Models.Interfaces;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using IXCheckCommonLib.AppFunctions;
using System.Security.Cryptography;
using System.Text;
using System.Collections;

namespace IXCheckCandidateApi.AppValidations
{
    public class ApplicationCommonFunctions
    {
        public static Dictionary<string, (string, string)> ColumnsListByObjectType(ApplicationEnumeration.ObjectType _objectType)
        {
            //Dictionary With Available Columns with Data Types
            Dictionary<string, (string, string)> _dictionayColumns = new Dictionary<string, (string, string)>();
            switch (_objectType)
            {
                case ApplicationEnumeration.ObjectType.ExamList:
                   // _dictionayColumns = GetExamList();
                    break;
                case ApplicationEnumeration.ObjectType.ExamShiftList:
                    //_dictionayColumns = GetExamShiftList();
                    break;
            }
            return _dictionayColumns;
        }
      
     

        /// <summary>
        /// Columns List
        /// </summary>
        /// <param name="_httpColumns"></param>
        /// <returns>Dictionary<string, (string, string)></returns>
        public static Dictionary<string, (string, string)> ColumnsList(List<string> _httpColumns, ApplicationEnumeration.ObjectType _objectType)
        {
            Dictionary<string, (string, string)> _dictionary = new Dictionary<string, (string, string)>();
            if (_httpColumns != null && _httpColumns.Count > 0)
            {
                //Dictionary With Available Columns with Data Types
                Dictionary<string, (string, string)> _dictionayColumns = ColumnsListByObjectType(_objectType);

                // Check Passed columns in available columns for the object
                if (_dictionayColumns != null)
                {
                    foreach (string str in _httpColumns)
                    {
                        string _key = str.ToLower();
                        if (_dictionayColumns.ContainsKey(_key))
                        {
                            _dictionary.Add(str, _dictionayColumns[_key]);
                        }
                        else
                        {
                            // Any column not exists in available columns 
                            _dictionary = null;
                            break;
                        }
                    }
                }
            }
            return _dictionary;
        }

        public static (string jsonReturn, IFunctionReturn functionReturn) ProcessRemoteHttpClientRequest(Enumeration.RequestType _requestType, IHttpClientFunctions _httpClientFunctions, HttpClientRequestParam _httpClientRequestParam)
        {
            // , Uri _requestUri, string _accessToken, string _requestJson, TimeSpan _requestTimeout
            string _jsonReturn = string.Empty;
            IFunctionReturn _functionReturn = new FunctionReturn();
            //_functionReturn.Status = false;
            Task<IHttpClientResponse> _responseTuple = null;
            string _methodName = "F:ApplicationCommon:ProcessRemoteHttpClientRequest";
            try
            {
                if (_httpClientRequestParam == null)
                {
                    _functionReturn = CommonFunctions.AppError(Constants.GenericMessages.RequiredParametersMissing, _methodName);
                }
                else
                {
                    if (_requestType == Enumeration.RequestType.FORM)
                    {
                        _responseTuple = _httpClientFunctions.HttpClientFormEncodedRequestAsync(_httpClientRequestParam);
                    }
                    else
                    {
                        _responseTuple = _httpClientFunctions.HttpClientRequestAsync(_httpClientRequestParam);
                    }

                    IHttpClientResponse _httpClientResponse = _responseTuple.Result;
                    var _response = JsonConvert.DeserializeObject(_httpClientResponse.Body);

                    //Checking the response is successful or not which is sent using HttpClient  
                    if (_httpClientResponse.Status == false)
                    {
                        //Parse ApiErrorResponse
                        try
                        {
                            ApiErrorResponse _apiErrorResponse = new ApiErrorResponse();
                            _apiErrorResponse = JsonConvert.DeserializeObject<ApiErrorResponse>(_response.ToString());
                            if (_apiErrorResponse?.Data[0]?.Attributes?.Message == null)
                            {
                                _functionReturn = CommonFunctions.AppError("Un-Expected Error, Could Not Parse Server Response", _methodName);
                            }
                            else
                            {
                                _functionReturn = CommonFunctions.AppError(_apiErrorResponse?.Data[0]?.Attributes.Message[0], _methodName);
                                _functionReturn.MessageType = _apiErrorResponse?.Data[0].Type;

                            }
                        }
                        catch (Exception ex)
                        {
                            _functionReturn = CommonFunctions.SystemError(ex.Message, _methodName);
                        }
                    }
                    else
                    {
                        var _result = JsonConvert.DeserializeObject(_response.ToString(), new JsonSerializerSettings { Formatting = Formatting.None });
                        _jsonReturn = _result.ToString();
                        _functionReturn.Status = true;
                        _functionReturn.HttpStatusCode = Constants.HttpStatusCodes.OK;
                        _functionReturn.MessageType = Constants.ReturnMessageTypes.GoodReturn;
                    }
                }
            }
            catch (Exception ex)
            {
                _functionReturn = CommonFunctions.SystemError(ex.Message, _methodName);
            }
            finally
            {
                _responseTuple?.Dispose();
            }

            return (_jsonReturn, _functionReturn);
        }


        //public static (string jsonReturn, IFunctionReturn functionReturn) ProcessRemoteRequest(Uri _requestUri, string _accessToken, string _requestJson, TimeSpan _requestTimeout)
        //{
        //IFunctionReturn _functionReturn = new FunctionReturn();
        //   string _jsonReturn = string.Empty;
        //  //  _functionReturn = new FunctionReturn();
        //    _functionReturn.Status = false;
        //    try
        //    {
        //        Task<(bool, string, System.Net.Http.Headers.HttpHeaders)> _responseTuple = _httpClientFunction.RestCallPostTokenTimeoutAndReturnHeaderAndStatus(_accessToken, _requestUri, _requestJson, _requestTimeout);
        //        (bool _responseStatus, string _responseBody, System.Net.Http.Headers.HttpHeaders _responseHeaders) = _responseTuple.Result;
        //        var _response = JsonConvert.DeserializeObject(_responseBody);

        //        //Checking the response is successful or not which is sent using HttpClient  
        //        if (_responseStatus == true)
        //        {
        //            var _result = JsonConvert.DeserializeObject(_response.ToString(), new JsonSerializerSettings { Formatting = Formatting.None });
        //            _jsonReturn = _result.ToString();
        //            _functionReturn.Status = true;
        //        }
        //        else
        //        {
        //            _functionReturn.Status = false;
        //            _functionReturn.HttpStatusCode = Constants.HttpStatusCodes.Unauthorized;
        //            //Parse ApiErrorResponse
        //            try
        //            {
        //                if (_response != null)
        //                {
        //                    ApiErrorResponse _apiErrorResponse = new ApiErrorResponse();
        //                    _apiErrorResponse = JsonConvert.DeserializeObject<ApiErrorResponse>(_response.ToString());
        //                    if (_apiErrorResponse?.Data[0]?.Attributes.Message != null)
        //                    {
        //                        _functionReturn.MessageType = _apiErrorResponse?.Data[0].Type;
        //                        _functionReturn.Message = _apiErrorResponse?.Data[0]?.Attributes.Message;
        //                    }
        //                    else
        //                    {
        //                        _functionReturn.MessageType = Constants.ReturnMessageTypes.AppError;
        //                        _functionReturn.Message.Add("Un-Expected Error, Could Not Parse Server Response");
        //                    }
        //                }
        //                else
        //                {
        //                    _functionReturn.MessageType = Constants.ReturnMessageTypes.AppError;
        //                    _functionReturn.Message.Add("Un-Expected Error, Server Response is NULL");
        //                }
        //            }
        //            catch (Exception ex)
        //            {
        //                _functionReturn.MessageType = Constants.ReturnMessageTypes.AppError;
        //                _functionReturn.Message.Add(ex.Message);
        //            }
        //        }
        //    }
        //    catch (Exception ex)
        //    {
        //        _functionReturn.Status = false;
        //        _functionReturn.HttpStatusCode = Constants.HttpStatusCodes.Unauthorized;
        //        _functionReturn.MessageType = Constants.ReturnMessageTypes.AppError;
        //        _functionReturn.Message.Add(ex.Message);
        //    }

        //    return (_jsonReturn, _functionReturn);
        //}
        #region PAYUMONEY
        public static string PAYUMONEYCheckSum(Dictionary<string, string> data)
        {
            byte[] hash;
            string _data = data["MERCHANT_KEY"] + "|" + data["ORDER_ID"] + "|" + data["TXN_AMOUNT"] + "|" + "Registration" + "|" + data["NAME"] + "|" + data["EMAIL"] + "|||||||||||" + data["MERCHANT_SALT"];
            using (SHA512 shaM = new SHA512Managed())
            {
                hash = shaM.ComputeHash(Encoding.UTF8.GetBytes(_data));
            }
            return GetStringFromHash(hash);
        }
        public static string GetStringFromHash(byte[] hash)
        {
            StringBuilder result = new StringBuilder();
            for (int i = 0; i < hash.Length; i++)
            {
                result.Append(hash[i].ToString("X2").ToLower());
            }
            return result.ToString();
        }
        public static string Generatehash512(string text)
        {
            byte[] message = Encoding.UTF8.GetBytes(text);

            UnicodeEncoding UE = new UnicodeEncoding();
            byte[] hashValue;
            SHA512Managed hashString = new SHA512Managed();
            string hex = "";
            hashValue = hashString.ComputeHash(message);
            foreach (byte x in hashValue)
            {
                hex += String.Format("{0:x2}", x);
            }
            return hex;
        }
        public static string PreparePOSTForm(string url, Hashtable data)
        {
            //Set a name for the form
            string formID = "PostForm";
            //Build the form using the specified data to be posted.
            StringBuilder strForm = new StringBuilder();
            strForm.Append("<form id=\"" + formID + "\" name=\"" +
            formID + "\" action=\"" + url +
            "\" method=\"POST\">");

            foreach (System.Collections.DictionaryEntry key in data)
            {
                strForm.Append("<input type=\"hidden\" name=\"" + key.Key +
                "\" value=\"" + key.Value + "\">");
            }

            strForm.Append("</form>");
            //Build the JavaScript which will do the Posting operation.
            StringBuilder strScript = new StringBuilder();
            strScript.Append("<script language='javascript'>");
            strScript.Append("var v" + formID + " = document." +
            formID + ";");
            strScript.Append("v" + formID + ".submit();");
            strScript.Append("</script>");
            //Return the form and the script concatenated.
            //(The order is important, Form then JavaScript)
            return strForm.ToString() + strScript.ToString();
        }
        #endregion
    }
}