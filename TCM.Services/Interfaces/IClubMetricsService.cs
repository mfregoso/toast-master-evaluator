using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TCM.Models.Domain;

namespace TCM.Services.Interfaces
{
    public interface IClubMetricsService
    {
        List<ClubMetrics> GetMetricsById(int id);
        int GetClubMembership(int id);
    }
}
