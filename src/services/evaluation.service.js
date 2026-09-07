import api from "@/api/axios";

const evaluationService = {
  // GET /api/v1/evaluations?page=1&limit=10&search=...
  getAll(params = {}) {
    return api.get("/evaluations", { params });
  },

  // GET /api/v1/evaluations/submission/:submissionId
  getBySubmissionId(submissionId) {
    return api.get(`/evaluations/submission/${submissionId}`);
  },

  // Backward compatible alias
  getEvaluationBySubmissionId(submissionId) {
    return this.getBySubmissionId(submissionId);
  },

  // POST /api/v1/evaluations
  create(data) {
    return api.post("/evaluations", data);
  },

  // PUT /api/v1/evaluations/submission/:submissionId
  updateBySubmissionId(submissionId, data) {
    return api.put(`/evaluations/submission/${submissionId}`, data);
  },

  // Backward compatible alias
  updateEvaluationBySubmissionId(submissionId, data) {
    return this.updateBySubmissionId(submissionId, data);
  },

  // DELETE /api/v1/evaluations/submission/:submissionId
  deleteBySubmissionId(submissionId) {
    return api.delete(`/evaluations/submission/${submissionId}`);
  },

  // Backward compatible alias
  deleteEvaluationBySubmissionId(submissionId) {
    return this.deleteBySubmissionId(submissionId);
  },
};

export default evaluationService;