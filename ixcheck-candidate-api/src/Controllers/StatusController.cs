using IXCheckCommonLib.Globals;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;

namespace IXCheckCandidateApi.Controllers
{
    [Route("api/" + Constants.Api.Version + "/[controller]")]
    [ApiController]
    public class StatusController : ControllerBase
    {

        [HttpGet]
        [AllowAnonymous]
        public IEnumerable<string> Get()
        {
            //*************************************************************
            // Required Permission: AllowAnonymous
            //*************************************************************
            return new string[] { "ixcheck-candidate-api", System.Environment.MachineName, "Status", "OK" };
        }
    }
}
