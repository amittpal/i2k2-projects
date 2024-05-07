using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IXCheckCandidateApi.Models
{
    public class AiFacesDetails
    {
        public int IsData { get; set; }
        public int AiPhotoX { get; set; }
        public string AiPhotoY { get; set; }
        public int AiPhotoHeight { get; set; }
        public int AiPhotoWidth { get; set; }
        public decimal AiPhotoPercent { get; set; }
    }
}