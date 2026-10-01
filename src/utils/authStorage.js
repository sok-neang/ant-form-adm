const STORAGE_KEYS = {
  // Temporary 2FA flow
  interimToken: "interimToken",
  twoFactorStep: "twoFactorStep",
  qrCodeDataUri: "qrCodeDataUri",
  totpSecret: "totpSecret",

  // Final authentication
  // Note: Refresh tokens are securely managed via HttpOnly cookies (withCredentials: true)
  accessToken: "accessToken",
  user: "user",
};

// ========================================
// Two Factor Data
// ========================================

export const saveTwoFactorData = ({
  interimToken,
  twoFactorStep,
  qrCodeDataUri,
  totpSecret,
}) => {
  const data = {
    interimToken,
    twoFactorStep,
    qrCodeDataUri,
    totpSecret,
  };

  Object.entries(data).forEach(([key, value]) => {
    if (value) {
      sessionStorage.setItem(
        STORAGE_KEYS[key],
        value
      );
    }
  });
};

export const getTwoFactorData = () => {
  return {
    interimToken: sessionStorage.getItem(
      STORAGE_KEYS.interimToken
    ),

    twoFactorStep: sessionStorage.getItem(
      STORAGE_KEYS.twoFactorStep
    ),

    qrCodeDataUri: sessionStorage.getItem(
      STORAGE_KEYS.qrCodeDataUri
    ),

    totpSecret: sessionStorage.getItem(
      STORAGE_KEYS.totpSecret
    ),
  };
};

export const clearTwoFactorData = () => {
  [
    STORAGE_KEYS.interimToken,
    STORAGE_KEYS.twoFactorStep,
    STORAGE_KEYS.qrCodeDataUri,
    STORAGE_KEYS.totpSecret,
  ].forEach((key) => {
    sessionStorage.removeItem(key);
  });
};

// ========================================
// Authentication Data
// ========================================

export const saveAuthData = ({
  accessToken,
}) => {
  if (accessToken) {
    localStorage.setItem(
      STORAGE_KEYS.accessToken,
      accessToken
    );
  }
};

export const getAuthData = () => {
  return {
    accessToken:
      localStorage.getItem(STORAGE_KEYS.accessToken) ||
      sessionStorage.getItem(STORAGE_KEYS.accessToken) ||
      "",
  };
};

export const clearAuthData = () => {
  [
    STORAGE_KEYS.accessToken,
    STORAGE_KEYS.user,
  ].forEach((key) => {
    localStorage.removeItem(key);
    sessionStorage.removeItem(key);
  });
};