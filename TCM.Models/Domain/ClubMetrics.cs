using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TCM.Models.Domain
{
    public class ClubMetrics
    {
        public string MonthEnd { get; set; }
        public int? Members { get; set; }
        public int? Goals { get; set; }
    }
}
