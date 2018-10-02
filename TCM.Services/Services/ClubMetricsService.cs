using AngleSharp.Parser.Html;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using TCM.Models.Domain;
using TCM.Services.Interfaces;

namespace TCM.Services
{
    public class ClubMetricsService : IClubMetricsService
    {
        public List<ClubMetrics> GetMetricsById(int id)
        {
            string BaseUrl = "https://www.marshalls.org/tmtools/DCP_Hist.cgi?mon=cur&club=";
            
            using (var client = new HttpClient())
            {
                var tmTools = client.GetStringAsync(BaseUrl + id).Result;
                var parseHtml = new HtmlParser();
                var dataTable = parseHtml.Parse(tmTools);
                var dataRows = dataTable.QuerySelector("table");
                var data = dataRows.QuerySelectorAll("tr").Skip(3);
                List<ClubMetrics> clubMetrics = new List<ClubMetrics>();
                foreach (var row in data)
                {
                    ClubMetrics metrics = new ClubMetrics();
                    int members = 0;
                    bool hasMembers = int.TryParse(row.ChildNodes[7].TextContent, out members);
                    int goals = 0;
                    bool hasGoals = int.TryParse(row.ChildNodes[8].TextContent, out goals);
                    metrics.MonthEnd = row.ChildNodes[0].TextContent;
                    metrics.Members = members;
                    metrics.Goals = goals;

                    clubMetrics.Add(metrics);
                }
                return clubMetrics;
            }
        }
    }
}
