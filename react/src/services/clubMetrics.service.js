import axios from "axios";

export default function GetClubMetrics(id) {
  return axios({
    url: "/api/club/" + id,
    method: "get"
  });
}
