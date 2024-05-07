using IXCheckCommonLib.Globals;
using IXCheckCommonLib.Models;
using System;
using System.Globalization;
using System.Text.RegularExpressions;

namespace IXCheckCandidateApi.AppValidations
{
    public class ApplicationValidationFunctions
    {
        bool _invalid = false;

        /// <summary>
        /// Validate US Phone Number
        /// </summary>
        /// <param name="_phone"></param>
        /// <returns></returns>
        public static bool IsValidUSPhone(string _phone)
        {
            try
            {
                if (string.IsNullOrEmpty(_phone))
                    return false;
                var r = new Regex(@"/^[+]*[(]{0,1}[0-9]{1,3}[)]{0,1}[-\s\./0-9]*$/g");
                return r.IsMatch(_phone);

            }
            catch (Exception)
            {
                return false;
            }
        }
        /// <summary>
        /// Validate Phone Number
        /// </summary>
        /// <param name="_phone"></param>
        /// <returns></returns>
        public static bool IsValidPhone(string _phone)
        {
            try
            {
                if (string.IsNullOrEmpty(_phone))
                    return false;
                var r = new Regex(@"^\(?([0-9]{3})\)?[-.●]?([0-9]{3})[-.●]?([0-9]{4})$");
                return r.IsMatch(_phone);

            }
            catch (Exception)
            {
                return false;
            }
        }
        /// <summary>
        /// Validate Email Id
        /// </summary>
        /// <param name="_email"></param>
        /// <returns>bool</returns>
        public bool IsValidEmail(string _email)
        {
            _invalid = false;
            if (String.IsNullOrEmpty(_email))
                return false;

            // Use IdnMapping class to convert Unicode domain names.
            try
            {
                _email = Regex.Replace(_email, @"(@)(.+)$", this.DomainMapper,
                                      RegexOptions.None, TimeSpan.FromMilliseconds(200));
            }
            catch (RegexMatchTimeoutException)
            {
                return false;
            }

            if (_invalid)
                return false;

            // Return true if _email is in valid e-mail format.
            try
            {
                return Regex.IsMatch(_email,
                      @"^(?("")("".+?(?<!\\)""@)|(([0-9a-z]((\.(?!\.))|[-!#\$%&'\*\+/=\?\^`\{\}\|~\w])*)(?<=[0-9a-z])@))" +
                      @"(?(\[)(\[(\d{1,3}\.){3}\d{1,3}\])|(([0-9a-z][-\w]*[0-9a-z]*\.)+[a-z0-9][\-a-z0-9]{0,22}[a-z0-9]))$",
                      RegexOptions.IgnoreCase, TimeSpan.FromMilliseconds(250));
            }
            catch (RegexMatchTimeoutException)
            {
                return false;
            }
        }
        /// <summary>
        /// Domain Mapper
        /// </summary>
        /// <param name="_match"></param>
        /// <returns>string</returns>
        private string DomainMapper(Match _match)
        {
            // IdnMapping class with default property values.
            IdnMapping _idnMapping = new IdnMapping();

            string _domainName = _match.Groups[2].Value;
            try
            {
                _domainName = _idnMapping.GetAscii(_domainName);
            }
            catch (ArgumentException)
            {
                _invalid = true;
            }
            return _match.Groups[1].Value + _domainName;
        }

        public static bool IsValidEmail(string _email, bool _useRegex)
        {
            try
            {
                if (_useRegex)
                {
                    Regex regex = new Regex(@"^([\w\.\-]+)@([\w\-]+)((\.(\w){2,3})+)$");
                    Match match = regex.Match(_email);
                    if (match.Success)
                        return true;
                    else
                        return false;
                }
                else { return false; }
            }
            catch { return false; }
        }

        private static Regex _allowedUsernameRegex = new Regex(
      "^(\\b[A-Za-z]*\\b\\s+\\b[A-Za-z]*\\b+\\.[A-Za-z])$", RegexOptions.IgnoreCase
    | RegexOptions.CultureInvariant
    | RegexOptions.IgnorePatternWhitespace
    | RegexOptions.Compiled
    );

        public static bool IsValidUserName(string _username)
        {
            if (string.IsNullOrEmpty(_username)
                || !_allowedUsernameRegex.IsMatch(_username)
                )
            {
                return false;
            }
            return true;
        }

        /// <summary>
        /// 1. It must contain at least a number
        /// 2. One upper case letter
        /// 3. Min 8 characters long and Max 15 Characters Long.
        /// </summary>
        private static Regex _allowedPasswordRegex = new Regex(@"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,15}$");

        public static bool IsValidPassword(string _password)
        {
            if (string.IsNullOrEmpty(_password)
                 || !_allowedUsernameRegex.IsMatch(_password)
                 )
            {
                return false;
            }
            return true;
        }

        /// <summary>
        /// Validate Date
        /// </summary>
        /// <param name="_phone"></param>
        /// <returns></returns>
        public static bool IsValidDate(string _date)
        {
            try
            {
                if (string.IsNullOrEmpty(_date))
                    return false;
                DateTime _dt = Convert.ToDateTime(_date);
                return true;
            }
            catch (Exception)
            {
                return false;
            }
        }

        /// <summary>
        /// Validate User Input
        /// </summary>
        /// <param name="_userLogin"></param>
        /// <returns>string</returns>
        public static string ValidateUserLoginInput(UserLogin _userLogin)
        {
            var _errorMessage = string.Empty;
            if (_userLogin == null)
            {
                _errorMessage = Constants.UserMessages.UserDataRequired;
            }
            else if (string.IsNullOrEmpty(_userLogin.UserName) && string.IsNullOrEmpty(_userLogin.Password))
            {
                _errorMessage = Constants.UserMessages.UsernamePasswordBothRequired;
            }
            else if (string.IsNullOrEmpty(_userLogin.UserName))
            {
                _errorMessage = Constants.UserMessages.UsernameRequired;
            }
            else if (string.IsNullOrEmpty(_userLogin.Password))
            {
                _errorMessage = Constants.UserMessages.UserPasswordRequired;
            }
            return _errorMessage;
        }
    }
}
