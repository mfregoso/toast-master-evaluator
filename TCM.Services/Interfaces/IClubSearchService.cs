using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TCM.Services.Interfaces
{
    public interface IClubSearchService
    {
        JObject SearchClubs(string query, int radius, double lat, double lng);
    }
}
