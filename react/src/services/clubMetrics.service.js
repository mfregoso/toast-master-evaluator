import axios from "axios";

export default function GetClubMetrics(id) {
  return axios({
    url: "/api/metrics?Club=" + id,
    method: "get"
  });
}
