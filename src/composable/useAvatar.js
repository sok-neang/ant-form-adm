import { ref, watch, isRef, onBeforeUnmount } from "vue";
import avatarService from "@/services/avatar.service";

/**
 * Modern SVG fallback avatar (grey user silhouette)
 */
export const DEFAULT_AVATAR =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 128 128'><circle cx='64' cy='64' r='64' fill='%23e2e8f0'/><circle cx='64' cy='46' r='24' fill='%2394a3b8'/><path d='M24 112c0-22 18-40 40-40s40 18 40 40' fill='%2394a3b8'/></svg>";

// Global in-memory cache of object URLs: path -> blobUrl
const avatarBlobCache = new Map();

// In-flight promise tracker to prevent duplicate requests
const inFlightRequests = new Map();

// Cache of submission file object URLs: filename -> blobUrl
const submissionBlobCache = new Map();
const inFlightSubmissionRequests = new Map();

/**
 * Fetch and cache a submission file URL (photo, transcript, etc.) with Bearer token authentication.
 * @param {string} path - Filename, relative path, or full file URL
 * @returns {Promise<string>} Object URL or fallback avatar
 */
export async function getSubmissionFileUrl(path) {
  if (!path) {
    return DEFAULT_AVATAR;
  }

  // If already a base64 or blob URL, return directly
  if (path.startsWith("data:") || path.startsWith("blob:")) {
    return path;
  }

  // Normalize key by stripping path directory and queries
  const filename = path.split("/").pop().split("?")[0];

  // Return cached object URL if already loaded
  if (submissionBlobCache.has(filename)) {
    return submissionBlobCache.get(filename);
  }

  // Reuse ongoing request if another component is fetching the same file
  if (inFlightSubmissionRequests.has(filename)) {
    return inFlightSubmissionRequests.get(filename);
  }

  const fetchPromise = (async () => {
    try {
      const blob = await avatarService.getSubmissionFileBlob(filename);
      const objectUrl = URL.createObjectURL(blob);
      submissionBlobCache.set(filename, objectUrl);
      return objectUrl;
    } catch (err) {
      console.warn(
        `[useAvatar] Failed to load submission file "${filename}":`,
        err?.response?.status || err.message
      );
      return DEFAULT_AVATAR;
    } finally {
      inFlightSubmissionRequests.delete(filename);
    }
  })();

  inFlightSubmissionRequests.set(filename, fetchPromise);
  return fetchPromise;
}

/**
 * Fetch and cache an avatar URL with Bearer token authentication.
 * @param {string} path - Filename or path to avatar
 * @returns {Promise<string>} Object URL or fallback avatar
 */
export async function getAvatarUrl(path) {
  if (!path) {
    return DEFAULT_AVATAR;
  }

  // If already a base64 or blob URL, return directly
  if (path.startsWith("data:") || path.startsWith("blob:")) {
    return path;
  }

  // If it's a submission file, route to getSubmissionFileUrl
  if (path.includes("/uploads/submissions/") || path.includes("uploads/submissions/")) {
    return getSubmissionFileUrl(path);
  }

  // If external non-backend avatar URL (e.g. Google profile picture), return directly
  const isBackendAvatar = path.includes("/uploads/avatars/") || !path.includes("://");
  if (!isBackendAvatar) {
    return path;
  }

  // Normalize key by stripping path directory and queries
  const filename = path.split("/").pop().split("?")[0];

  // Return cached object URL if already loaded
  if (avatarBlobCache.has(filename)) {
    return avatarBlobCache.get(filename);
  }

  // Reuse ongoing request if another component is fetching the same avatar
  if (inFlightRequests.has(filename)) {
    return inFlightRequests.get(filename);
  }

  const fetchPromise = (async () => {
    try {
      const blob = await avatarService.getAvatarBlob(filename);
      const objectUrl = URL.createObjectURL(blob);
      avatarBlobCache.set(filename, objectUrl);
      return objectUrl;
    } catch (err) {
      console.warn(`[useAvatar] Failed to load avatar "${filename}":`, err?.response?.status || err.message);
      return DEFAULT_AVATAR;
    } finally {
      inFlightRequests.delete(filename);
    }
  })();

  inFlightRequests.set(filename, fetchPromise);
  return fetchPromise;
}

/**
 * Invalidate a cached avatar (e.g. after user updates their avatar)
 * @param {string} path
 */
export function invalidateAvatarCache(path) {
  if (!path) return;
  const filename = path.split("/").pop().split("?")[0];
  if (avatarBlobCache.has(filename)) {
    const oldUrl = avatarBlobCache.get(filename);
    if (oldUrl && oldUrl.startsWith("blob:")) {
      URL.revokeObjectURL(oldUrl);
    }
    avatarBlobCache.delete(filename);
  }
}

/**
 * Reusable Composable for Vue components
 * @param {import('vue').Ref<string> | string | null} initialPath
 */
export const useAvatar = (initialPath = null) => {
  const avatarUrl = ref(DEFAULT_AVATAR);
  const loading = ref(false);
  const error = ref(null);

  const loadAvatar = async (path) => {
    if (!path) {
      avatarUrl.value = DEFAULT_AVATAR;
      return DEFAULT_AVATAR;
    }

    loading.value = true;
    error.value = null;
    try {
      const url = await getAvatarUrl(path);
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
        (newVal) => {
          loadAvatar(newVal);
        },
        { immediate: true }
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
