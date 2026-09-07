import api from "@/api/axios";

const dashboardService = {
  getStats() {
    return api.get("/dashboard/stats");
  },
};

export default dashboardService;
