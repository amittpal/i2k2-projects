using IXCheckCommonLib.Models.Interfaces;
using System;
using System.Collections.Generic;
using System.Text;

namespace IXCheckCommonLib.Models
{
    public class MailAttachment: IMailAttachment
    {
        public MailAttachment()
        {
            Path = "";
            FileName = "";
            Content = "";
            FileType = "";
        }

        public MailAttachment(string _path, string _fileName, string _content, string _fileType)
        {
            Path = _path;
            FileName = _fileName;
            Content = _content;
            FileType = _fileType;
        }

        public string Path { get; set; }
        public string FileName { get; set; }
        public string Content { get; set; }
        public string FileType { get; set; }
    }
}
