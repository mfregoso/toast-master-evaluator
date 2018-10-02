using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using TCM.Services;
using TCM.Models.Responses;
using Newtonsoft.Json.Linq;
using TCM.Services.Interfaces;
using TCM.Models.Domain;

namespace TCM.Web.Controllers
{
    [RoutePrefix("api/metrics")]
    public class ClubMetricsController : ApiController
    {
        readonly IClubMetricsService clubMetricsService;
        public ClubMetricsController(IClubMetricsService clubMetricsService)
        {
            this.clubMetricsService = clubMetricsService;
        }       

        [Route, HttpGet]
        public HttpResponseMessage GetByClubId(int Club)
        {
            List<ClubMetrics> metrics = clubMetricsService.GetMetricsById(Club);
            return Request.CreateResponse(HttpStatusCode.OK, new ItemsResponse<ClubMetrics> { Items = metrics });
        }

        [Route("members"), HttpGet]
        public HttpResponseMessage GetClubMembershipCount(int Club)
        {
            int membershipCount = clubMetricsService.GetClubMembership(Club);
            return Request.CreateResponse(HttpStatusCode.OK, new ItemResponse<int> { Item = membershipCount });
        }
    }
}
