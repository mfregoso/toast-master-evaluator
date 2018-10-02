import axios from "axios";

export function GetClubMetrics(id) {
  return axios({
    url: "/api/metrics?Club=" + id,
    method: "get"
  });
}

export function GetClubMembership(id) {
  return axios({
    url: "/api/metrics/members?Club=" + id,
    method: "get"
  });
}
