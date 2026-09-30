import { ref, watch, isRef } from "vue";
import avatarService from "@/services/avatar.service";
import defaultAvatar from "@/assets/images/img/default_avatar.webp";


export const DEFAULT_AVATAR = defaultAvatar;

export function isDefaultAvatar(fileUrl) {
  if (!fileUrl) return true;
  if (typeof fileUrl !== "string") return false;
  const lower = fileUrl.trim().toLowerCase();
  return (
    !lower ||
    lower === "null" ||
    lower === "undefined" ||
    lower === "none" ||
    lower.includes("default-avatar") ||
    lower.includes("default_avatar")
  );
}

const avatarBlobCache = new Map();
const inFlightRequests = new Map();
const submissionBlobCache = new Map();
const inFlightSubmissionRequests = new Map();
export async function getSubmissionFileUrl(fileUrl) {
  if (!fileUrl) {
    return DEFAULT_AVATAR;
  }
  if (
    fileUrl.startsWith("data:") ||
    fileUrl.startsWith("blob:")
  ) {
    return fileUrl;
  }
  const cacheKey = fileUrl.includes("/uploads/")
    ? fileUrl.substring(fileUrl.indexOf("/uploads/"))
    : fileUrl.includes("uploads/")
    ? `/${fileUrl.substring(fileUrl.indexOf("uploads/"))}`
    : fileUrl;

  if (submissionBlobCache.has(cacheKey)) {
    return submissionBlobCache.get(cacheKey);
  }
  if (inFlightSubmissionRequests.has(cacheKey)) {
    return inFlightSubmissionRequests.get(cacheKey);
  }

  const fetchPromise = (async () => {
    try {
      const blob =
        await avatarService.getSubmissionFileBlob(fileUrl);

      if (!blob || blob.size === 0 || blob.type === "application/json" || blob.type?.includes("html")) {
        throw new Error("Invalid blob received");
      }

      const objectUrl = URL.createObjectURL(blob);

      submissionBlobCache.set(cacheKey, objectUrl);

      return objectUrl;
    } catch (err) {
      console.warn(
        `[useAvatar] Failed to load submission file "${fileUrl}":`,
        err?.response?.status || err?.message
      );

      // Return the fileUrl itself so consumers can load it directly via <img> or browser
      return fileUrl;
    } finally {
      inFlightSubmissionRequests.delete(cacheKey);
    }
  })();

  inFlightSubmissionRequests.set(cacheKey, fetchPromise);

  return fetchPromise;
}
export async function getAvatarUrl(fileUrl) {
  if (!fileUrl || isDefaultAvatar(fileUrl)) {
    return DEFAULT_AVATAR;
  }

  if (
    fileUrl.startsWith("data:") ||
    fileUrl.startsWith("blob:")
  ) {
    return fileUrl;
  }
  const isHttpUrl =
    fileUrl.startsWith("http://") ||
    fileUrl.startsWith("https://");

  const isBackendAvatar =
    fileUrl.includes("/uploads/avatars/") ||
    fileUrl.includes("uploads/avatars/") ||
    fileUrl.includes("ant-form-backend");

  if (isHttpUrl && !isBackendAvatar) {
    return fileUrl;
  }
  const cacheKey = fileUrl.includes("/uploads/")
    ? fileUrl.substring(fileUrl.indexOf("/uploads/"))
    : fileUrl;

  if (avatarBlobCache.has(cacheKey)) {
    return avatarBlobCache.get(cacheKey);
  }
  if (inFlightRequests.has(cacheKey)) {
    return inFlightRequests.get(cacheKey);
  }

  const fetchPromise = (async () => {
    try {
      const blob =
        await avatarService.getAvatarBlob(fileUrl);

      if (!blob || blob.size === 0 || blob.type === "application/json" || blob.type?.includes("html")) {
        throw new Error("Invalid blob received");
      }

      const objectUrl = URL.createObjectURL(blob);

      avatarBlobCache.set(cacheKey, objectUrl);

      return objectUrl;
    } catch (err) {
      console.warn(
        `[useAvatar] Failed to load avatar "${fileUrl}":`,
        err?.response?.status || err?.message
      );

      return DEFAULT_AVATAR;
    } finally {
      inFlightRequests.delete(cacheKey);
    }
  })();

  inFlightRequests.set(cacheKey, fetchPromise);

  return fetchPromise;
}
export function invalidateAvatarCache(fileUrl) {
  if (!fileUrl) {
    for (const [, objectUrl] of avatarBlobCache.entries()) {
      if (objectUrl?.startsWith("blob:")) {
        URL.revokeObjectURL(objectUrl);
      }
    }
    avatarBlobCache.clear();
    for (const [, objectUrl] of submissionBlobCache.entries()) {
      if (objectUrl?.startsWith("blob:")) {
        URL.revokeObjectURL(objectUrl);
      }
    }
    submissionBlobCache.clear();
    return;
  }

  const cacheKey = fileUrl.includes("/uploads/")
    ? fileUrl.substring(fileUrl.indexOf("/uploads/"))
    : fileUrl;

  if (avatarBlobCache.has(cacheKey)) {
    const objectUrl = avatarBlobCache.get(cacheKey);

    if (objectUrl?.startsWith("blob:")) {
      URL.revokeObjectURL(objectUrl);
    }

    avatarBlobCache.delete(cacheKey);
  }

  if (submissionBlobCache.has(cacheKey)) {
    const objectUrl = submissionBlobCache.get(cacheKey);

    if (objectUrl?.startsWith("blob:")) {
      URL.revokeObjectURL(objectUrl);
    }

    submissionBlobCache.delete(cacheKey);
  }
}
export const useAvatar = (initialPath = null) => {
  const avatarUrl = ref(DEFAULT_AVATAR);
  const loading = ref(false);
  const error = ref(null);

  const loadAvatar = async (fileUrl) => {
    if (!fileUrl || isDefaultAvatar(fileUrl)) {
      avatarUrl.value = DEFAULT_AVATAR;
      return DEFAULT_AVATAR;
    }

    loading.value = true;
    error.value = null;

    try {
      const url = await getAvatarUrl(fileUrl);

      avatarUrl.value = url;

      return url;
    } catch (err) {
      error.value = err;
      avatarUrl.value = DEFAULT_AVATAR;

      return DEFAULT_AVATAR;
    } finally {
      loading.value = false;
    }
  };

  if (initialPath) {
    if (isRef(initialPath)) {
      watch(
        initialPath,
        (newValue) => {
          loadAvatar(newValue);
        },
        {
          immediate: true,
        }
      );
    } else {
      loadAvatar(initialPath);
    }
  }

  return {
    avatarUrl,
    loading,
    error,

    loadAvatar,
    getAvatarUrl,
    getSubmissionFileUrl,
    invalidateAvatarCache,
  };
};

export default useAvatar;