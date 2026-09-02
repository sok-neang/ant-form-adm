import api from "@/api/axios";
const authService = {
  login(data) { 
    return api.post("/auth/login", data);
  },
  verify2FA(data) {
    return api.post("/auth/verify-2fa", data);
  },

  verifyOtp(data, interimToken) {
    return api.post(
      "/auth/2fa/verify",
      data,
      {
        headers: {
          Authorization: `Bearer ${interimToken}`,
        },
      }
    );
  },


  resetDefaultPassword(data, interimToken) {
    return api.put("/auth/change-default-password",
       data,
      {
      headers: {
        Authorization: `Bearer ${interimToken}`,
      },
    });
  },


    getProfile() {
      return api.get("/auth/profile");
    },

  logout() {
    return api.delete("/auth/logout");
  },


};

export default authService;