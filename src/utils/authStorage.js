const STORAGE_KEYS = {
  // Temporary 2FA flow
  interimToken: "interimToken",
  twoFactorStep: "twoFactorStep",
  qrCodeDataUri: "qrCodeDataUri",
  totpSecret: "totpSecret",

  // Final authentication
  accessToken: "accessToken",
  refreshToken: "refreshToken",
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
  refreshToken,
  user,
}) => {
  if (accessToken) {
    sessionStorage.setItem(
      STORAGE_KEYS.accessToken,
      accessToken
    );
  }

  if (refreshToken) {
    sessionStorage.setItem(
      STORAGE_KEYS.refreshToken,
      refreshToken
    );
  }

  if (user) {
    sessionStorage.setItem(
      STORAGE_KEYS.user,
      JSON.stringify(user)
    );
  }
};

export const getAuthData = () => {
  const user = sessionStorage.getItem(
    STORAGE_KEYS.user
  );

  return {
    accessToken: sessionStorage.getItem(
      STORAGE_KEYS.accessToken
    ),

    refreshToken: sessionStorage.getItem(
      STORAGE_KEYS.refreshToken
    ),

    user: user ? JSON.parse(user) : null,
  };
};

export const clearAuthData = () => {
  [
    STORAGE_KEYS.accessToken,
    STORAGE_KEYS.refreshToken,
    STORAGE_KEYS.user,
  ].forEach((key) => {
    sessionStorage.removeItem(key);
  });
};