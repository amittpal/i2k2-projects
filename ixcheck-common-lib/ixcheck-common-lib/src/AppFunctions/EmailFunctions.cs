using IXCheckCommonLib.AppFunctions.Interfaces;
using IXCheckCommonLib.AppValidations;
using IXCheckCommonLib.Globals;
using IXCheckCommonLib.Models;
using IXCheckCommonLib.Models.Interfaces;
using System;
using System.Collections.Generic;
using System.Net;
using System.Net.Mail;
using System.Text;
using System.Threading.Tasks;

namespace IXCheckCommonLib.AppFunctions
{
    public class EmailFunctions : IEmailFunctions
    {
        private readonly IEmailSettings _emailSettings;
        private readonly ILoggerFunctions _loggerFunctions;
        private readonly ICacheFunctions _cacheFunctions;
        private readonly IApiSettings _apiSettings;
        private IFunctionReturn _functionReturn;
        private static string _configTypeName;
        private static string _sendGridApiKey = "";
        private static string _mailServer = "";
        private static string _portNumber = "";
        private static string _fromEmail = "";
        private static string _fromEmailName = "";
        private static string _username = "";
        private static string _password = "";
        private static string _adminApplicationURL = "";
        private static string _techApplicationURL = "";

        /// <summary>
        /// Constructor
        /// </summary>
        /// <param name="__emailSettings"></param>
        /// <param name="__cacheFunctions"></param>
        /// <param name="__loggerFunctions"></param>
        public EmailFunctions(IEmailSettings __emailSettings, ICacheFunctions __cacheFunctions, ILoggerFunctions __loggerFunctions, IApiSettings __apiSettings)
        {
            _emailSettings = __emailSettings;
            _loggerFunctions = __loggerFunctions;
            _cacheFunctions = __cacheFunctions;
            _apiSettings = __apiSettings;
            LoadDefaulEmailSettings();

        }

        /// <summary>
        /// Load Defaul Email Settings From Config File
        /// </summary>
        private void LoadDefaulEmailSettings()
        {
            _configTypeName = string.IsNullOrEmpty(_emailSettings.ConfigTypeName) ? "email" : _emailSettings.ConfigTypeName;
            _sendGridApiKey = _emailSettings.SendGridAPIKey;
            _mailServer = _emailSettings.MailServer;
            _portNumber = Convert.ToString(_emailSettings.PortNumber);
            _fromEmail = _emailSettings.FromEmail;
            _fromEmailName = _emailSettings.FromEmailName;
            _username = _emailSettings.Username;
            _password = _emailSettings.Password;
            _adminApplicationURL = _emailSettings.AdminServerURL;
            _techApplicationURL = _emailSettings.TechServerURL;

           
        }


        /// <summary>
        /// Load  Email Settings From Config File
        /// </summary>
        private void LoadEmailSettings(IEmailSettings _emailSettings)
        {
            _configTypeName = string.IsNullOrEmpty(_emailSettings.ConfigTypeName) ? "email" : _emailSettings.ConfigTypeName;
            _sendGridApiKey = _emailSettings.SendGridAPIKey;
            _mailServer = _emailSettings.MailServer;
            _portNumber = Convert.ToString(_emailSettings.PortNumber);
            _fromEmail = _emailSettings.FromEmail;
            _fromEmailName = _emailSettings.FromEmailName;
            _username = _emailSettings.Username;
            _password = _emailSettings.Password;
            _adminApplicationURL = _emailSettings.AdminServerURL;
            _techApplicationURL = _emailSettings.TechServerURL;




        }





        /// <summary>
        /// Send Mail With Setting
        /// </summary>
        /// <param name="_emailParams"></param>
        /// <param name="_emailSettings"></param>
        /// <returns></returns>
        public bool SendMail(IEmailParams _emailParams, IEmailSettings _emailSettings)
        {
            string _methodName = "EmailFunctions:SendMail";
            bool _success = true;
            string _errorMessage = "";
            try
            {
                _functionReturn = new FunctionReturn();
                if (_emailParams == null)
                {
                    _errorMessage = "Email Parameters Missing";
                }
                else if (_emailParams.MailTo == null && _emailParams.MailTo.Count <= 0)
                {
                    _errorMessage = "Mail To Parameter is Missing";
                }
                else if (_emailParams.MailTo.Count > 0)
                {
                    foreach (Models.MailAddress _mail in _emailParams.MailTo)
                    {
                        if (!ValidationFunctions.IsValidEmail(_mail.Email, true))
                        {
                            _errorMessage = "Mail To contains invalid email";
                        }
                    }
                }
                else if (_emailParams.MailCc != null && _emailParams.MailCc.Count > 0)
                {
                    foreach (Models.MailAddress _mail in _emailParams.MailCc)
                    {
                        if (!ValidationFunctions.IsValidEmail(_mail.Email, true))
                        {
                            _errorMessage = "Mail Cc contains invalid email";
                        }
                    }
                }
                else if (_emailParams.MailBcc != null && _emailParams.MailBcc.Count > 0)
                {
                    foreach (Models.MailAddress _mail in _emailParams.MailBcc)
                    {
                        if (!ValidationFunctions.IsValidEmail(_mail.Email, true))
                        {
                            _errorMessage = "Mail Bcc contains invalid email";
                        }
                    }
                }

                if (!string.IsNullOrEmpty(_errorMessage))
                {
                    _success = false;
                    _functionReturn.Status = false;
                    _functionReturn.MessageType = Constants.ReturnMessageTypes.AppError;
                    _functionReturn.Message.Add(_errorMessage);
                    _functionReturn.HttpStatusCode = Constants.HttpStatusCodes.Unauthorized;
                }

                if (_success)
                {

                    bool _emailSettingsFound = CheckEmailSettingsInCache();
                    if (_emailSettingsFound)
                    {
                        if (_emailSettings != null)
                        {
                            LoadEmailSettings(_emailSettings);

                        }
                        _errorMessage = CheckConfigSettings();
                        if (!string.IsNullOrEmpty(_errorMessage))
                        {
                            _success = false;
                            _functionReturn.Status = false;
                            _functionReturn.MessageType = Constants.ReturnMessageTypes.AppError;
                            _functionReturn.Message.Add(_errorMessage);
                            _functionReturn.HttpStatusCode = Constants.HttpStatusCodes.Unauthorized;
                        }
                        if (_success)
                        {
                            MailMessage _mailMessage = new MailMessage();
                            SmtpClient _smtpClient = new SmtpClient();
                            if (_emailParams.MailFrom != null && !string.IsNullOrEmpty(_emailParams.MailFrom.Email))
                            {
                                if (!string.IsNullOrEmpty(_emailParams.MailFrom.Name))
                                {
                                    _mailMessage.From = new System.Net.Mail.MailAddress(_emailParams.MailFrom.Email, _emailParams.MailFrom.Name);
                                }
                                else
                                {
                                    _mailMessage.From = new System.Net.Mail.MailAddress(_emailParams.MailFrom.Email);
                                }
                            }
                            else
                            {
                                if (!string.IsNullOrEmpty(_fromEmailName))
                                {
                                    _mailMessage.From = new System.Net.Mail.MailAddress(_fromEmail, _fromEmailName);
                                }
                                else
                                {
                                    _mailMessage.From = new System.Net.Mail.MailAddress(_fromEmail);
                                }
                            }

                            foreach (Models.MailAddress _mailTo in _emailParams.MailTo)
                            {
                                if (!string.IsNullOrEmpty(_mailTo.Email))
                                {
                                    if (!string.IsNullOrEmpty(_mailTo.Name))
                                    {
                                        _mailMessage.To.Add(new System.Net.Mail.MailAddress(_mailTo.Email.Trim(), _mailTo.Name));
                                    }
                                    else
                                    {
                                        _mailMessage.To.Add(new System.Net.Mail.MailAddress(_mailTo.Email.Trim()));
                                    }
                                }
                            }
                            foreach (Models.MailAddress _mailCc in _emailParams.MailCc)
                            {
                                if (!string.IsNullOrEmpty(_mailCc.Email))
                                {
                                    if (!string.IsNullOrEmpty(_mailCc.Name))
                                    {
                                        _mailMessage.CC.Add(new System.Net.Mail.MailAddress(_mailCc.Email.Trim(), _mailCc.Name));
                                    }
                                    else
                                    {
                                        _mailMessage.CC.Add(new System.Net.Mail.MailAddress(_mailCc.Email.Trim()));
                                    }
                                }
                            }
                            foreach (Models.MailAddress _mailBcc in _emailParams.MailBcc)
                            {
                                if (!string.IsNullOrEmpty(_mailBcc.Email))
                                {
                                    if (!string.IsNullOrEmpty(_mailBcc.Name))
                                    {
                                        _mailMessage.Bcc.Add(new System.Net.Mail.MailAddress(_mailBcc.Email.Trim(), _mailBcc.Name));
                                    }
                                    else
                                    {
                                        _mailMessage.Bcc.Add(new System.Net.Mail.MailAddress(_mailBcc.Email.Trim()));
                                    }
                                }
                            }
                            _mailMessage.Subject = _emailParams.MailSubject;
                            _mailMessage.IsBodyHtml = _emailParams.IsHtml; //to make message body as html  
                            _mailMessage.Body = _emailParams.MailBody;
                            int i = 0;
                            foreach (MailAttachment _attachment in _emailParams.MailAttachment)
                            {
                                if (!string.IsNullOrEmpty(_attachment.Content.Trim()))
                                {
                                    string _base64String = _attachment.Content;
                                    int _lastIndex = _base64String.LastIndexOf("base64,");
                                    if (_lastIndex > 0)
                                    {
                                        _lastIndex += 7;
                                        int _length = _base64String.Length - _lastIndex;
                                        _base64String = _base64String.Substring(_lastIndex, _length);
                                    }
                                    byte[] _byteArray = Convert.FromBase64String(_base64String);
                                    System.IO.Stream _stm = new System.IO.MemoryStream(_byteArray, 0, _byteArray.Length);
                                    if (!string.IsNullOrEmpty(_attachment.FileName.Trim()))
                                    {
                                        _mailMessage.Attachments.Add(new System.Net.Mail.Attachment(_stm, _attachment.FileName));
                                    }
                                    else
                                    {
                                        _mailMessage.Attachments.Add(new System.Net.Mail.Attachment(_stm, "attachment " + (++i).ToString()));
                                    }
                                }
                                //if (!string.IsNullOrEmpty(_attachment.Path))
                                //{
                                //    _mailMessage.Attachments.Add(new System.Net.Mail.Attachment(_attachment.Path));
                                //}
                            }
                            _smtpClient.Port = Convert.ToInt32(_portNumber);
                            _smtpClient.Host = _mailServer; //for gmail host  
                            _smtpClient.EnableSsl = false;
                            _smtpClient.UseDefaultCredentials = false;  //was true
                            _smtpClient.Credentials = new NetworkCredential(_username, _password);
                            _smtpClient.DeliveryMethod = SmtpDeliveryMethod.Network;
                            _smtpClient.Send(_mailMessage);
                            _success = true;
                            _smtpClient?.Dispose();
                            _smtpClient = null;
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                _success = false;
                CommonFunctions.Log(Enumeration.LogLevel.Error, _loggerFunctions, ex.Message, _methodName);
            }
            return _success;
        }

        /// <summary>
        /// Send Mail Async
        /// </summary>
        /// <param name="_emailParams"></param>
        /// <param name="_emailSettings"></param>
        /// <returns></returns>
        public Task<bool> SendMailAsync(IEmailParams _emailParams, IEmailSettings _emailSettings)
        {
            return Task.Run(() => SendMail(_emailParams, _emailSettings));
        }



        /// <summary>
        /// Send Mail
        /// </summary>
        /// <param name="_emailParams"></param>
        /// <returns></returns>
        public bool SendMail(IEmailParams _emailParams)
        {
            string _methodName = "EmailFunctions:SendMail";
            bool _success = true;
            string _errorMessage = "";
            try
            {
                _functionReturn = new FunctionReturn();
                if (_emailParams == null)
                {
                    _errorMessage = "Email Parameters Missing";
                }
                else if (_emailParams.MailTo == null && _emailParams.MailTo.Count <= 0)
                {
                    _errorMessage = "Mail To Parameter is Missing";
                }
                else if (_emailParams.MailTo.Count > 0)
                {
                    foreach (Models.MailAddress _mail in _emailParams.MailTo)
                    {
                        if (!ValidationFunctions.IsValidEmail(_mail.Email, true))
                        {
                            _errorMessage = "Mail To contains invalid email";
                        }
                    }
                }
                else if (_emailParams.MailCc != null && _emailParams.MailCc.Count > 0)
                {
                    foreach (Models.MailAddress _mail in _emailParams.MailCc)
                    {
                        if (!ValidationFunctions.IsValidEmail(_mail.Email, true))
                        {
                            _errorMessage = "Mail Cc contains invalid email";
                        }
                    }
                }
                else if (_emailParams.MailBcc != null && _emailParams.MailBcc.Count > 0)
                {
                    foreach (Models.MailAddress _mail in _emailParams.MailBcc)
                    {
                        if (!ValidationFunctions.IsValidEmail(_mail.Email, true))
                        {
                            _errorMessage = "Mail Bcc contains invalid email";
                        }
                    }
                }

                if (!string.IsNullOrEmpty(_errorMessage))
                {
                    _success = false;
                    _functionReturn.Status = false;
                    _functionReturn.MessageType = Constants.ReturnMessageTypes.AppError;
                    _functionReturn.Message.Add(_errorMessage);
                    _functionReturn.HttpStatusCode = Constants.HttpStatusCodes.Unauthorized;
                }

                if (_success)
                {

                    bool _emailSettingsFound = CheckEmailSettingsInCache();
                    if (_emailSettingsFound)
                    {
                       
                        _errorMessage = CheckConfigSettings();
                        if (!string.IsNullOrEmpty(_errorMessage))
                        {
                            _success = false;
                            _functionReturn.Status = false;
                            _functionReturn.MessageType = Constants.ReturnMessageTypes.AppError;
                            _functionReturn.Message.Add(_errorMessage);
                            _functionReturn.HttpStatusCode = Constants.HttpStatusCodes.Unauthorized;
                        }
                        if (_success)
                        {
                            MailMessage _mailMessage = new MailMessage();
                            SmtpClient _smtpClient = new SmtpClient();
                            if (_emailParams.MailFrom != null && !string.IsNullOrEmpty(_emailParams.MailFrom.Email))
                            {
                                if (!string.IsNullOrEmpty(_emailParams.MailFrom.Name))
                                {
                                    _mailMessage.From = new System.Net.Mail.MailAddress(_emailParams.MailFrom.Email, _emailParams.MailFrom.Name);
                                }
                                else
                                {
                                    _mailMessage.From = new System.Net.Mail.MailAddress(_emailParams.MailFrom.Email);
                                }
                            }
                            else
                            {
                                if (!string.IsNullOrEmpty(_fromEmailName))
                                {
                                    _mailMessage.From = new System.Net.Mail.MailAddress(_fromEmail, _fromEmailName);
                                }
                                else
                                {
                                    _mailMessage.From = new System.Net.Mail.MailAddress(_fromEmail);
                                }
                            }

                            foreach (Models.MailAddress _mailTo in _emailParams.MailTo)
                            {
                                if (!string.IsNullOrEmpty(_mailTo.Email))
                                {
                                    if (!string.IsNullOrEmpty(_mailTo.Name))
                                    {
                                        _mailMessage.To.Add(new System.Net.Mail.MailAddress(_mailTo.Email.Trim(), _mailTo.Name));
                                    }
                                    else
                                    {
                                        _mailMessage.To.Add(new System.Net.Mail.MailAddress(_mailTo.Email.Trim()));
                                    }
                                }
                            }
                            foreach (Models.MailAddress _mailCc in _emailParams.MailCc)
                            {
                                if (!string.IsNullOrEmpty(_mailCc.Email))
                                {
                                    if (!string.IsNullOrEmpty(_mailCc.Name))
                                    {
                                        _mailMessage.CC.Add(new System.Net.Mail.MailAddress(_mailCc.Email.Trim(), _mailCc.Name));
                                    }
                                    else
                                    {
                                        _mailMessage.CC.Add(new System.Net.Mail.MailAddress(_mailCc.Email.Trim()));
                                    }
                                }
                            }
                            foreach (Models.MailAddress _mailBcc in _emailParams.MailBcc)
                            {
                                if (!string.IsNullOrEmpty(_mailBcc.Email))
                                {
                                    if (!string.IsNullOrEmpty(_mailBcc.Name))
                                    {
                                        _mailMessage.Bcc.Add(new System.Net.Mail.MailAddress(_mailBcc.Email.Trim(), _mailBcc.Name));
                                    }
                                    else
                                    {
                                        _mailMessage.Bcc.Add(new System.Net.Mail.MailAddress(_mailBcc.Email.Trim()));
                                    }
                                }
                            }
                            _mailMessage.Subject = _emailParams.MailSubject;
                            _mailMessage.IsBodyHtml = _emailParams.IsHtml; //to make message body as html  
                            _mailMessage.Body = _emailParams.MailBody;
                            int i = 0;
                            foreach (MailAttachment _attachment in _emailParams.MailAttachment)
                            {
                                if (!string.IsNullOrEmpty(_attachment.Content.Trim()))
                                {
                                    string _base64String = _attachment.Content;
                                    int _lastIndex = _base64String.LastIndexOf("base64,");
                                    if (_lastIndex > 0)
                                    {
                                        _lastIndex += 7;
                                        int _length = _base64String.Length - _lastIndex;
                                        _base64String = _base64String.Substring(_lastIndex, _length);
                                    }
                                    byte[] _byteArray = Convert.FromBase64String(_base64String);
                                    System.IO.Stream _stm = new System.IO.MemoryStream(_byteArray, 0, _byteArray.Length);
                                    if (!string.IsNullOrEmpty(_attachment.FileName.Trim()))
                                    {
                                        _mailMessage.Attachments.Add(new System.Net.Mail.Attachment(_stm, _attachment.FileName));
                                    }
                                    else
                                    {
                                        _mailMessage.Attachments.Add(new System.Net.Mail.Attachment(_stm, "attachment " + (++i).ToString()));
                                    }
                                }
                                if (!string.IsNullOrEmpty(_attachment.Path))
                                {
                                    _mailMessage.Attachments.Add(new System.Net.Mail.Attachment(_attachment.Path));
                                }
                            }
                            _smtpClient.Port = Convert.ToInt32(_portNumber);
                            _smtpClient.Host = _mailServer; //for gmail host  
                            _smtpClient.EnableSsl = false;
                            _smtpClient.UseDefaultCredentials = false;  //was true
                            _smtpClient.Credentials = new NetworkCredential(_username, _password);
                            _smtpClient.DeliveryMethod = SmtpDeliveryMethod.Network;
                            _smtpClient.Send(_mailMessage);
                            _success = true;
                            _smtpClient?.Dispose();
                            _smtpClient = null;
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                _success = false;
                CommonFunctions.Log(Enumeration.LogLevel.Error, _loggerFunctions, ex.Message, _methodName);
            }
            return _success;
        }

        /// <summary>
        /// Send Mail Async
        /// </summary>
        /// <param name="_emailParams"></param>
        /// <returns></returns>
        public Task<bool> SendMailAsync(IEmailParams _emailParams)
        {
            return Task.Run(() => SendMail(_emailParams));
        }

        /// <summary>
        /// Check Config Settings Values
        /// </summary>
        /// <returns></returns>
        private string CheckConfigSettings()
        {
            string _errorMessage = "";
            //if (string.IsNullOrEmpty(_sendGridApiKey))
            //{
            //    _errorMessage = "Send Grid Api Key is empty";
            //}
            //else 
            if (string.IsNullOrEmpty(_mailServer))
            {
                _errorMessage = "Mail Server is empty";
            }
            else if (string.IsNullOrEmpty(_portNumber))
            {
                _errorMessage = "Port Number is empty";
            }
            else if (string.IsNullOrEmpty(_fromEmail))
            {
                _errorMessage = "From Email is empty";
            }
            else if (string.IsNullOrEmpty(_username))
            {
                _errorMessage = "Username is empty";
            }
            else if (string.IsNullOrEmpty(_password))
            {
                _errorMessage = "Password is empty";
            }
            //else if (string.IsNullOrEmpty(_adminApplicationURL))
            //{
            //    _errorMessage = "Admin Application URL is empty";
            //}
            //else if (string.IsNullOrEmpty(_techApplicationURL))
            //{
            //    _errorMessage = "Tech Application URL is empty";
            //}
            return _errorMessage;
        }

        /// <summary>
        /// Check Email Settings In Cache
        /// </summary>
        /// <returns></returns>
        private bool CheckEmailSettingsInCache()
        {
            string _methodName = "EmailFunctions:CheckEmailSettingsInCache";
            bool retVal = true;
            bool _settingsMissing;
            List<ConfigSetting> _lstConfigSettings;
            IFunctionReturn _functionReturn;
            try
            {
                (_settingsMissing, _lstConfigSettings, _functionReturn) = _cacheFunctions.GetConfigSettingsFromCacheAsync(_configTypeName).Result;
                if (_settingsMissing || _lstConfigSettings.Count <= 0)
                {
                    (_settingsMissing, _lstConfigSettings, _functionReturn) = _cacheFunctions.InsertConfigSettingsInCacheAsync(_configTypeName).Result;
                }
                if (!_settingsMissing && _lstConfigSettings.Count > 0)
                {
                    foreach (ConfigSetting _configSetting in _lstConfigSettings)
                    {
                        switch (_configSetting.Key.ToLower())
                        {
                            case "send_grid_api_key":
                                _sendGridApiKey = string.IsNullOrEmpty(_configSetting.Value) ? "" : _configSetting.Value;
                                break;
                            case "mail_server":
                                _mailServer = string.IsNullOrEmpty(_configSetting.Value) ? "" : _configSetting.Value;
                                break;
                            case "port_number":
                                _portNumber = string.IsNullOrEmpty(_configSetting.Value) ? "" : _configSetting.Value;
                                break;
                            case "from_email":
                                _fromEmail = string.IsNullOrEmpty(_configSetting.Value) ? "" : _configSetting.Value;
                                break;
                            case "from_email_name":
                                _fromEmailName = string.IsNullOrEmpty(_configSetting.Value) ? "" : _configSetting.Value;
                                break;
                            case "username":
                                _username = string.IsNullOrEmpty(_configSetting.Value) ? "" : _configSetting.Value;
                                break;
                            case "password":
                                _password = string.IsNullOrEmpty(_configSetting.Value) ? "" : _configSetting.Value;
                                break;
                            case "admin_application_url":
                                _adminApplicationURL = string.IsNullOrEmpty(_configSetting.Value) ? "" : _configSetting.Value;
                                break;
                            case "tech_application_url":
                                _techApplicationURL = string.IsNullOrEmpty(_configSetting.Value) ? "" : _configSetting.Value;
                                break;
                            default: break;
                        }
                    }
                }
                else
                {
                    CommonFunctions.Log(Enumeration.LogLevel.Error, _loggerFunctions, _functionReturn?.Message[0], _methodName);
                }
            }
            catch (Exception ex)
            {
                retVal = false;
                CommonFunctions.Log(Enumeration.LogLevel.Error, _loggerFunctions, ex.Message, _methodName);
            }
            return retVal;
        }
    }
}
