import api from "@/api/axios";
const activityLogService = {
  loginHistory(params = {}) {
    return api.get("/auth/login-history", { params, });
  },
  auditLog(params = {}) {
    return api.get("/audit-logs", { params, });
  },
  auditLogRestore(params = {}) {
    return api.get("/audit-logs/restorable", { params, });
  },
  restoreRecord(table, id) {
    return api.post(`/audit-logs/${table}/${id}/restore`);
  },
  getAuditLogById(id) {
    return api.get(`/audit-logs/${id}`);
  },
};

export default activityLogService;