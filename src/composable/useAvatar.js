import { ref, watch, isRef } from "vue";
import avatarService from "@/services/avatar.service";
import defaultAvatar from "@/assets/images/img/default_avatar.webp";


export const DEFAULT_AVATAR = defaultAvatar;

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
  const cacheKey = fileUrl;
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

      const objectUrl = URL.createObjectURL(blob);

      submissionBlobCache.set(cacheKey, objectUrl);

      return objectUrl;
    } catch (err) {
      console.warn(
        `[useAvatar] Failed to load submission file "${fileUrl}":`,
        err?.response?.status || err?.message
      );

      return DEFAULT_AVATAR;
    } finally {
      inFlightSubmissionRequests.delete(cacheKey);
    }
  })();

  inFlightSubmissionRequests.set(cacheKey, fetchPromise);

  return fetchPromise;
}
export async function getAvatarUrl(fileUrl) {
  if (!fileUrl) {
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
  const cacheKey = fileUrl;
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
    return;
  }

  const cacheKey = fileUrl;

  if (avatarBlobCache.has(cacheKey)) {
    const objectUrl = avatarBlobCache.get(cacheKey);

    if (objectUrl?.startsWith("blob:")) {
      URL.revokeObjectURL(objectUrl);
    }

    avatarBlobCache.delete(cacheKey);
  }
}
export const useAvatar = (initialPath = null) => {
  const avatarUrl = ref(DEFAULT_AVATAR);
  const loading = ref(false);
  const error = ref(null);

  const loadAvatar = async (fileUrl) => {
    if (!fileUrl) {
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