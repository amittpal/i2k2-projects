using IXCheckCandidateApi.Models.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IXCheckCandidateApi.Models
{
    public class RegistrationsToCities : IRegistrationsToCities
    {
        public string RegistrationGuid { get; set; }
        public string CityNumber { get; set; }
        public string CityGuid { get; set; }
    }
}