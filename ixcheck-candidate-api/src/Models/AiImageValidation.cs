using IXCheckCandidateApi.Models.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IXCheckCandidateApi.Models
{
    public class AiImageValidation : IAiImageValidation
    {
        public string ComponentId { get; set; }
        public string Image { get; set; }
        public string CreateLog { get; set; }
        public string FacePercent { get; set; }
        public decimal ColorPercent { get; set; }
        public string AlgoGuid { get; set; }
        public string RegGuid { get; set; }
        public string ColorGuid { get; set; }
        public string BlueMin { get; set; }
        public string BlueMax { get; set; }
        public string GreenMin { get; set; }
        public string GreenMax { get; set; }
        public string RedMin { get; set; }
        public string RedMax { get; set; }
        public decimal ImageHeight { get; set; }
        public decimal ImageWidth { get; set; }
        public string ImageType { get; set; }
        public int Isdata { get; set; }
    }
}
