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
                List<ClubMetrics> clubMetrics = new List<ClubMetrics>();
                try
                {
                    var tmTools = client.GetStringAsync(BaseUrl + id).Result;
                    var parseHtml = new HtmlParser();
                    var dataTable = parseHtml.Parse(tmTools);
                    var dataRows = dataTable.QuerySelector("table");
                    var data = dataRows.QuerySelectorAll("tr").Skip(3);
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
                } catch
                {
                    System.Diagnostics.Debug.WriteLine("tmtools server error");
                }
                return clubMetrics;
            }
        }

        public int GetClubMembership(int id)
        {
            string BaseUrl = "http://dashboards.toastmasters.org/ClubReport.aspx?id=";
            int membershipCount = 0;

            using (var client = new HttpClient())
            {
                try
                {
                    var clubReport = client.GetStreamAsync(BaseUrl + id).Result;
                    var parseHtml = new HtmlParser();
                    var dataTable = parseHtml.Parse(clubReport);
                    var dataColumn = dataTable.QuerySelectorAll("table.clubStatusChart")[1];
                    var dataRow = dataColumn.QuerySelectorAll("table tr")[1];
                    var data = dataRow.QuerySelectorAll("td.chart_table_big_numbers")[1];
                    bool hasCount = int.TryParse(data.TextContent, out membershipCount);
                    System.Diagnostics.Debug.WriteLine(data.TextContent);
                }
                catch
                {
                    System.Diagnostics.Debug.WriteLine("toastmasters server error");
                }
            }

            return membershipCount;
        }
    }
}
