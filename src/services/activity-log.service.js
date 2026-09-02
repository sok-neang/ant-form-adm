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
  
};

export default activityLogService;