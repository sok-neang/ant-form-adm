import { defineStore } from "pinia";
import { ref, computed } from "vue";

import authService from "@/services/auth.service";

import {
  saveTwoFactorData,
  getTwoFactorData,
  clearTwoFactorData,
  saveAuthData,
} from "@/utils/authStorage";

export const useAuthStore = defineStore("auth", () => {
  const storedTwoFactorData = getTwoFactorData();
  const interimToken = ref(storedTwoFactorData.interimToken || null);
  const twoFactorStep = ref( storedTwoFactorData.twoFactorStep || null );
  const qrCodeDataUri = ref(storedTwoFactorData.qrCodeDataUri || null);
  const totpSecret = ref(storedTwoFactorData.totpSecret || null);

  const accessToken = ref(sessionStorage.getItem("accessToken") || "" );
  const user = ref(null);
  const loading = ref(false);

  const isAuthenticated = computed(() => {return !!accessToken.value;});

  const login = async (credentials) => {
    loading.value = true;
    try {
      const response = await authService.login(credentials);
      const result = response.data;

      if (result.success && result.data?.step === "verify_2fa") {
        setTwoFactorData(result.data);
      }
      return result;
    }catch(error){
      console.error(error.response);
      
      
    }
     finally {
      loading.value = false;
    }
  };
  const verifyCodeOtp = async (data) => {
    loading.value = true;
    try {
      const response = await authService.verifyOtp(
        data,
        interimToken.value
      );
      const result = response.data;
      if (!result.success || !result.data) {
        return result;
      }

      // First login
      if (result.data.step === "change_default_password") {
        interimToken.value = result.data.interimToken;
        twoFactorStep.value = result.data.step;
        saveTwoFactorData({
          interimToken: interimToken.value,
          twoFactorStep: twoFactorStep.value,
        });
        return result;
      }

      // Normal login
      if (result.data.accessToken) {
        setAuthData(result.data);
        clearTwoFactorData();
      }
      return result;
    } finally {
      loading.value = false;
    }
  };

  // Change default password
  const changeDefaultPassword = async (data) => {
    loading.value = true;

    try {
      const response =
        await authService.resetDefaultPassword(
          data,
          interimToken.value
        );

      const result = response.data;

      if (
        result.success &&
        result.data?.accessToken
      ) {
        setAuthData(result.data);
        clearTwoFactor();
      }

      return result;
    } finally {
      loading.value = false;
    }
  };

  // Save authentication data
  const setAuthData = (data) => {
    accessToken.value = data.accessToken;
    user.value = data.user || null;
    // Only store access token
    // Refresh token is handled by HttpOnly cookie
    saveAuthData({
      accessToken: accessToken.value,
      user: user.value,
    });
  };


 const getProfile = async () => {
  loading.value = true;

  try {
    const response = await authService.getProfile();
    const result = response.data;
    if (result.success) {
      user.value = result.data;
      saveAuthData({
        accessToken: accessToken.value,
        user: user.value,
      });
    }
    return result;
  } finally {
    loading.value = false;
  }
};

  const logout = async () => {
    loading.value = true;
    try {
      const response =
        await authService.logout();

      const result = response.data;

      return result;
    } finally {
      // Clear frontend authentication state
      accessToken.value = "";
      user.value = null;

      sessionStorage.removeItem("accessToken");
      sessionStorage.removeItem("user");

      clearTwoFactor();

      loading.value = false;
    }
  };

  // Set 2FA data
  const setTwoFactorData = (data) => {
    interimToken.value =
      data.interimToken || null;

    twoFactorStep.value =
      data.step || null;

    qrCodeDataUri.value =
      data.setupTotp?.qrCodeDataUri || null;

    totpSecret.value =
      data.setupTotp?.secret || null;

    saveTwoFactorData({
      interimToken: interimToken.value,
      twoFactorStep: twoFactorStep.value,
      qrCodeDataUri: qrCodeDataUri.value,
      totpSecret: totpSecret.value,
    });
  };


  // Clear 2FA data
  const clearTwoFactor = () => {
    interimToken.value = null;
    twoFactorStep.value = null;
    qrCodeDataUri.value = null;
    totpSecret.value = null;

    clearTwoFactorData();
  };

  return {
    // Auth
    user,
    accessToken,
    isAuthenticated,
    loading,

    // 2FA
    interimToken,
    twoFactorStep,
    qrCodeDataUri,
    totpSecret,

    // Actions
    login,
    verifyCodeOtp,
    changeDefaultPassword,
    getProfile,
    logout,

    setTwoFactorData,
    clearTwoFactor,
  };
});