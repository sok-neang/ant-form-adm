import api from "@/api/axios";

const submissionService = {
  getShortlist(params = {}) {
    return api.get("/submissions/shortlist", { params });
  },
  getById(id) {
    return api.get(`/submissions/${id}`);
  },
};

export default submissionService;
