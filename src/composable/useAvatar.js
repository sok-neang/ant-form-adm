import { ref, watch, isRef } from "vue";
import avatarService from "@/services/avatar.service";

/**
 * Default avatar
 */
export const DEFAULT_AVATAR =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 128 128'><circle cx='64' cy='64' r='64' fill='%23e2e8f0'/><circle cx='64' cy='46' r='24' fill='%2394a3b8'/><path d='M24 112c0-22 18-40 40-40s40 18 40 40' fill='%2394a3b8'/></svg>";

/**
 * Cache avatar Blob URLs
 * key: fileUrl
 * value: blob URL
 */
const avatarBlobCache = new Map();

/**
 * Prevent duplicate avatar requests
 */
const inFlightRequests = new Map();

/**
 * Cache submission file Blob URLs
 * key: fileUrl
 * value: blob URL
 */
const submissionBlobCache = new Map();

/**
 * Prevent duplicate submission file requests
 */
const inFlightSubmissionRequests = new Map();

/**
 * Get a submission file as an object URL.
 *
 * IMPORTANT:
 * Uses the complete fileUrl from backend.
 *
 * Example:
 * https://ant-form-backend.g2.ant.com.kh/uploads/submissions/file.pdf
 */
export async function getSubmissionFileUrl(fileUrl) {
  if (!fileUrl) {
    return DEFAULT_AVATAR;
  }

  // Already an object/data URL
  if (
    fileUrl.startsWith("data:") ||
    fileUrl.startsWith("blob:")
  ) {
    return fileUrl;
  }

  // Use the complete backend fileUrl as cache key
  const cacheKey = fileUrl;

  // Return cached URL
  if (submissionBlobCache.has(cacheKey)) {
    return submissionBlobCache.get(cacheKey);
  }

  // Reuse existing request
  if (inFlightSubmissionRequests.has(cacheKey)) {
    return inFlightSubmissionRequests.get(cacheKey);
  }

  const fetchPromise = (async () => {
    try {
      console.log(
        "[useAvatar] Fetch submission file:",
        fileUrl
      );

      // IMPORTANT:
      // Send the FULL fileUrl to avatarService
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

/**
 * Get an avatar as an object URL.
 *
 * Uses the complete fileUrl from backend.
 */
export async function getAvatarUrl(fileUrl) {
  if (!fileUrl) {
    return DEFAULT_AVATAR;
  }

  // Already an object/data URL
  if (
    fileUrl.startsWith("data:") ||
    fileUrl.startsWith("blob:")
  ) {
    return fileUrl;
  }

  // External URL
  // Example: Google profile image
  const isHttpUrl =
    fileUrl.startsWith("http://") ||
    fileUrl.startsWith("https://");

  const isBackendAvatar =
    fileUrl.includes("/uploads/avatars/") ||
    fileUrl.includes("uploads/avatars/") ||
    fileUrl.includes("ant-form-backend");

  // If it's an external image URL, use it directly
  if (isHttpUrl && !isBackendAvatar) {
    return fileUrl;
  }

  // Use complete URL as cache key
  const cacheKey = fileUrl;

  // Return cached URL
  if (avatarBlobCache.has(cacheKey)) {
    return avatarBlobCache.get(cacheKey);
  }

  // Reuse existing request
  if (inFlightRequests.has(cacheKey)) {
    return inFlightRequests.get(cacheKey);
  }

  const fetchPromise = (async () => {
    try {
      console.log(
        "[useAvatar] Fetch avatar:",
        fileUrl
      );

      // IMPORTANT:
      // Send FULL fileUrl to service
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

/**
 * Remove avatar from cache
 */
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

/**
 * Vue composable
 */
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