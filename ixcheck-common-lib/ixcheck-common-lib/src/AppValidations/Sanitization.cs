using System;
using System.Text.RegularExpressions;

namespace IXCheckCommonLib.AppValidations
{
    public class Sanitization
    {
        private static Regex _tags = new Regex("<[^>]*(>|$)", RegexOptions.Singleline | RegexOptions.ExplicitCapture | RegexOptions.Compiled);
        private static Regex _whitelist = new Regex(@"^</?(b(lockquote)?|code|d(d|t|l|el)|em|h(1|2|3)|i|kbd|li|ol|p(re)?|s(ub|up|trong|trike)?|ul)>$|^<(b|h)r\s?/?>$",
            RegexOptions.Singleline | RegexOptions.ExplicitCapture | RegexOptions.Compiled | RegexOptions.IgnorePatternWhitespace);
        private static Regex _whitelistA = new Regex(@"^<a\shref=""(\#\d+|(https?|ftp)://[-a-z0-9+&@#/%?=~_|!:,.;\(\)]+)""(\stitle=""[^""<>]+"")?\s?>$|^</a>$",
            RegexOptions.Singleline | RegexOptions.ExplicitCapture | RegexOptions.Compiled | RegexOptions.IgnorePatternWhitespace);
        private static Regex _whitelistImg = new Regex(@"^<img\ssrc=""https?://[-a-z0-9+&@#/%?=~_|!:,.;\(\)]+""(\swidth=""\d{1,3}"")?(\sheight=""\d{1,3}"")?(\salt=""[^""<>]*"")?(\stitle=""[^""<>]*"")?\s?/?>$",
            RegexOptions.Singleline | RegexOptions.ExplicitCapture | RegexOptions.Compiled | RegexOptions.IgnorePatternWhitespace);

        /// <summary>
        /// sanitize any potentially dangerous tags from the provided raw HTML input using 
        /// a whitelist based approach, leaving the "safe" HTML tags
        /// </summary>
        /// <param name="_inputValue"></param>
        /// <returns>string</returns>
        public static string Sanitize(string _inputValue)
        {
            if (String.IsNullOrEmpty(_inputValue)) return _inputValue;

            string _tagName;
            Match _tag;

            // match every HTML tag in the input
            MatchCollection _matchCollection = _tags.Matches(_inputValue);
            for (int i = _matchCollection.Count - 1; i > -1; i--)
            {
                _tag = _matchCollection[i];
                _tagName = _tag.Value.ToLowerInvariant();

                if (!(_whitelist.IsMatch(_tagName) || _whitelistA.IsMatch(_tagName) || _whitelistImg.IsMatch(_tagName)))
                {
                    _inputValue = _inputValue.Remove(_tag.Index, _tag.Length);
                }
            }
            return _inputValue.Replace("'", "''");
        }
    }
}
