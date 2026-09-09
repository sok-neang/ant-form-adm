import api from "@/api/axios";
import avatarService from "@/services/avatar.service";

const submissionService = {
  getShortlist(params = {}) {
    return api.get("/submissions/shortlist", { params });
  },
  getById(id) {
    return api.get(`/submissions/${id}`);
  },
  getFileBlob(path) {
    return avatarService.getSubmissionFileBlob(path);
  },
};

export default submissionService;
