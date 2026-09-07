import api from "@/api/axios";
const evaluationService = {
  getAll(params = {}) {
    return api.get("/evaluations", { params, });
  },
  getEvaluationBySubmissionId(id) {
    return api.get(`/evaluations/submission/${id}`);
  },
  create(data) {
    return api.post("/evaluations", data);
  },
  updateEvaluationBySubmissionId(id, data) {
    return api.put(`/evaluations/submission/${id}`, data);
  },
  deleteEvaluationBySubmissionId(id) {
    return api.delete(`/evalutions/submission/${id}`);
  },
};

export default evaluationService;