import { defineStore } from "pinia";
import { ref, computed, watch } from "vue";

import authService from "@/services/auth.service";

import {
  saveTwoFactorData,
  getTwoFactorData,
  clearTwoFactorData,
  saveAuthData,
  getAuthData,
  clearAuthData,
} from "@/utils/authStorage";
import { refreshAccessToken } from "@/api/axios";
import {
  getAvatarUrl,
  invalidateAvatarCache,
  DEFAULT_AVATAR,
  isDefaultAvatar,
} from "@/composable/useAvatar";

export function isValidJwt(token) {
  if (!token || typeof token !== "string") return false;
  const parts = token.split(".");
  if (parts.length !== 3) return false;

  try {
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    const payload = JSON.parse(jsonPayload);
    if (payload.exp && payload.exp * 1000 < Date.now()) {
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

export const useAuthStore = defineStore("auth", () => {
  const storedTwoFactorData = getTwoFactorData();
  const interimToken = ref(storedTwoFactorData.interimToken || null);
  const twoFactorStep = ref(storedTwoFactorData.twoFactorStep || null);
  const qrCodeDataUri = ref(storedTwoFactorData.qrCodeDataUri || null);
  const totpSecret = ref(storedTwoFactorData.totpSecret || null);

  const initialAuth = getAuthData();
  const initialToken =
    initialAuth.accessToken ||
    localStorage.getItem("accessToken") ||
    sessionStorage.getItem("accessToken") ||
    "";

  // Only initialize as valid if not expired.
  // Note: We do NOT wipe storage here so the router can attempt
  // a silent refresh using the HttpOnly refresh token cookie.
  const accessToken = ref(isValidJwt(initialToken) ? initialToken : "");
  const user = ref(null);
  const userAvatarUrl = ref(DEFAULT_AVATAR);
  const loading = ref(false);
  const isUpdateProfileLoading = ref(false);
  const isUploadAvatarLoading = ref(false);
  const isDeleteAvatarLoading = ref(false);
  const isLogoutLoading = ref(false);

  const isAuthenticated = computed(() => {
    return !!accessToken.value && isValidJwt(accessToken.value);
  });

  const getUserAvatarPath = () => {
    if (!user.value) return null;
    const raw =
      user.value.avatarPath ||
      user.value.avatarUrl ||
      user.value.avatar ||
      user.value.photoUrl ||
      user.value.filePath ||
      user.value.fileUrl ||
      null;
    if (!raw || isDefaultAvatar(raw)) return null;
    return raw;
  };

  const loadUserAvatar = async () => {
    const avatar = getUserAvatarPath();
    if (avatar && !isDefaultAvatar(avatar)) {
      userAvatarUrl.value = await getAvatarUrl(avatar);
    } else {
      userAvatarUrl.value = DEFAULT_AVATAR;
    }
  };

  watch(
    () => getUserAvatarPath(),
    () => {
      loadUserAvatar();
    },
    { immediate: true }
  );

  // Sync token when refreshed in the background by axios interceptor
  if (typeof window !== "undefined") {
    window.addEventListener("auth:token-refreshed", (event) => {
      if (event.detail && typeof event.detail === "string") {
        accessToken.value = event.detail;
      }
    });
  }

  const login = async (credentials) => {
    loading.value = true;
    try {
      const response = await authService.login(credentials);
      const result = response.data;

      if (result.success && result.data?.step === "verify_2fa") {
        setTwoFactorData(result.data);
      }
      return result;
    } catch (error) {
      console.error("Login error:", error.response?.data || error);
      throw error;
    } finally {
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
    loadUserAvatar();
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
        await loadUserAvatar();

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

  const updateProfile = async (data) => {
    isUpdateProfileLoading.value = true;
    try {
      const response = await authService.updateProfile(data);
      const result = response.data;
      if (result.success) {
        user.value = result.data;
        await loadUserAvatar();
        saveAuthData({
          accessToken: accessToken.value,
          user: user.value,
        });
      }
      return result;
    } finally {
      isUpdateProfileLoading.value = false;
    }
  };

  const uploadAvatar = async (file) => {
    isUploadAvatarLoading.value = true;
    try {
      const oldPath = getUserAvatarPath();
      const response = await authService.uploadAvatar(file);
      const result = response.data;
      if (result.success) {
        invalidateAvatarCache(oldPath);
        const newPath = result.data?.avatarPath || result.data?.avatarUrl || result.data?.avatar;
        invalidateAvatarCache(newPath);
        user.value = result.data;
        await loadUserAvatar();
        saveAuthData({
          accessToken: accessToken.value,
          user: user.value,
        });
      }
      return result;
    } finally {
      isUploadAvatarLoading.value = false;
    }
  };

  const deleteAvatar = async () => {
    isDeleteAvatarLoading.value = true;
    try {
      const oldPath = getUserAvatarPath();
      const response = await authService.deleteAvatar();
      const result = response.data;
      if (result.success) {
        invalidateAvatarCache(oldPath);
        user.value = result.data;
        await loadUserAvatar();
        saveAuthData({
          accessToken: accessToken.value,
          user: user.value,
        });
      }
      return result;
    } finally {
      isDeleteAvatarLoading.value = false;
    }
  };


  const logout = async () => {
    isLogoutLoading.value = true;
    try {
      const response =
        await authService.logout();

      return response.data;
    } catch (err) {
      console.warn("Logout request failed or token was already invalid:", err?.message);
    } finally {
      // Clear frontend authentication state
      accessToken.value = "";
      user.value = null;
      userAvatarUrl.value = DEFAULT_AVATAR;

      clearAuthData();
      sessionStorage.removeItem("accessToken");
      sessionStorage.removeItem("user");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");

      clearTwoFactor();

      isLogoutLoading.value = false;
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

  // Attempt silent refresh using HttpOnly cookie
  const trySilentRefresh = async () => {
    try {
      const newToken = await refreshAccessToken();
      accessToken.value = newToken;
      return newToken;
    } catch (error) {
      accessToken.value = "";
      user.value = null;
      clearAuthData();
      localStorage.removeItem("accessToken");
      sessionStorage.removeItem("accessToken");
      throw error;
    }
  };

  return {
    // Auth
    user,
    userAvatarUrl,
    accessToken,
    isAuthenticated,
    loading,

    // 2FA
    interimToken,
    twoFactorStep,
    qrCodeDataUri,
    totpSecret,

    // Loading States
    isUpdateProfileLoading,
    isUploadAvatarLoading,
    isDeleteAvatarLoading,
    isLogoutLoading,

    // Actions
    login,
    verifyCodeOtp,
    changeDefaultPassword,
    getProfile,
    updateProfile,
    uploadAvatar,
    deleteAvatar,
    loadUserAvatar,
    logout,

    setTwoFactorData,
    clearTwoFactor,
    trySilentRefresh,
  };
});