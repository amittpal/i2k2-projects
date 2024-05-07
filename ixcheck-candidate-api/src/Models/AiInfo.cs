using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IXCheckCandidateApi.Models
{
  public  class AiInfo
    {
        public int IsData { get; set; }
        public int AiPhotoX { get; set; }
        public int AiPhotoY { get; set; }
        public int AiPhotoHeight { get; set; }
        public int AiPhotoWidth { get; set; }
        public int AiThreshhold { get; set; }
        public decimal AiPhotoPercent { get; set; }
        public decimal ImageHeight { get; set; }
        public decimal ImageWidth { get; set; }
        public string ImageType { get; set; }
        public string FileName { get; set; }
        public string ValidationMessage { get; set; }
        public decimal ColorPercent { get; set; }
        public AiFacesDetails aiFacesDetails { get; set; }
        public AiImageValidation aiImageValidation { get; set; }
    }
}