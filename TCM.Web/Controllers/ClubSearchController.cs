using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using TCM.Models.Responses;
using TCM.Services;
using TCM.Services.Interfaces;

namespace TCM.Web.Controllers
{
    [RoutePrefix("api/search")]
    public class ClubSearchController : ApiController
    {
        readonly IClubSearchService clubSearchService;
        public ClubSearchController(IClubSearchService clubSearchService)
        {
            this.clubSearchService = clubSearchService;
        }

        [Route, HttpGet]
        public HttpResponseMessage SearchClubs(string query, int radius, double latitude, double longitude)
        {
            JObject clubs = clubSearchService.SearchClubs(query, radius, latitude, longitude);
            return Request.CreateResponse(HttpStatusCode.OK, new ClubsResponse<JObject> { Items = clubs });
        }
    }
}
