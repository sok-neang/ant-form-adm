import api from "@/api/axios";
const userService = {
  getAll(params = {}) {
    return api.get("/users", { params, });
  },
  getSummaries() {
    return api.get("/dashboard/users/stats");
  },
  getById(id) {
    return api.get(`/users/${id}`);
  },
  create(data) {
    return api.post("/users", data);
  },
  resetPassword(id) {
    return api.put(`/users/${id}/reset-password`);
  },
  update(id, data) {
    return api.put(`/users/${id}`, data);
  },
  updateStatus(id, data) {
    return api.put(`/users/${id}/status`, data);
  },
};

export default userService;