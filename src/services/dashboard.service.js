import api from "@/api/axios";

const dashboardService = {
  getStats() {
    return api.get("/dashboard/stats");
  },
  getStatsUser() {
    return api.get("/dashboard/users/stats");
  },
};
export default dashboardService;
