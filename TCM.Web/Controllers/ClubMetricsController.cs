using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using TCM.Services;
using TCM.Models.Responses;
using Newtonsoft.Json.Linq;

namespace TCM.Web.Controllers
{
    [RoutePrefix("api/club")]
    public class ClubMetricsController : ApiController
    {
        readonly ClubSearchService clubSearchService;
        public ClubMetricsController(ClubSearchService clubSearchService)
        {
            this.clubSearchService = clubSearchService;
        }       

        [Route("{Id:int}"), HttpGet]
        public HttpResponseMessage GetByClubId(int Id)
        {
            return Request.CreateResponse(HttpStatusCode.OK, "You asked for " + Id.ToString());
        }
    }
}
