import api from "@/api/axios";
function buildFullUrl(fileUrl, defaultFolder = "avatars") {
  if (!fileUrl) return "";
  let url = String(fileUrl).trim();
  if (url.startsWith("data:") || url.startsWith("blob:")) {
    return url;
  }

  // If it's a backend URL containing uploads/, route it via local proxy to avoid CORS
  if (url.includes("uploads/")) {
    const idx = url.indexOf("uploads/");
    return `/${url.substring(idx)}`;
  }

  // External URLs (e.g. Google avatar)
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }

  const clean = url.replace(/^\/+/, "");
  const lower = clean.toLowerCase();
  if (
    !lower ||
    lower === "null" ||
    lower === "undefined" ||
    lower === "none" ||
    lower === "uploads" ||
    lower === "uploads/" ||
    lower === "submissions" ||
    lower === "submissions/" ||
    lower === "avatars" ||
    lower === "avatars/" ||
    lower.endsWith("/")
  ) {
    return "";
  }

  if (clean.startsWith("uploads/")) {
    return `/${clean}`;
  }
  if (clean.startsWith("avatars/") || clean.startsWith("submissions/")) {
    return `/uploads/${clean}`;
  }
  if (clean.startsWith(`${defaultFolder}/`)) {
    return `/uploads/${clean}`;
  }
  return `/uploads/${defaultFolder}/${clean}`;
}

const BACKEND_HOST = import.meta.env.FILE_PATH 

const avatarService = {
  /**
   * Fetch avatar as a Blob.
   *
   * @param {string} fileUrl - Full URL, relative path, or filename
   * @returns {Promise<Blob>}
   */
  async getAvatarBlob(fileUrl) {
    const proxyUrl = buildFullUrl(fileUrl, "avatars");
    if (!proxyUrl && !fileUrl) {
      throw new Error("Avatar file URL is required");
    }

    // Try 1: Local proxy via fetch without credentials (avoids CORS preflight)
    if (proxyUrl) {
      try {
        const res = await fetch(proxyUrl, { headers: { Accept: "*/*" } });
        if (res.ok) {
          const type = res.headers.get("content-type") || "";
          if (!type.includes("html") && !type.includes("json")) {
            const blob = await res.blob();
            if (blob && blob.size > 0) return blob;
          }
        }
      } catch (e) {
        // Fall through to next attempt
      }
    }

    // Try 2: Axios with token
    if (proxyUrl) {
      try {
        const response = await api.get(proxyUrl, {
          baseURL: "",
          responseType: "blob",
          headers: {
            Accept: "*/*",
          },
        });
        if (response.data && response.data.size > 0 && !response.data.type?.includes("html")) {
          return response.data;
        }
      } catch (err) {
        // Fall through to next attempt
      }
    }

    // Try 3: Direct backend URL
    const raw = String(fileUrl || proxyUrl || "").trim();
    const directUrl =
      raw.startsWith("http://") || raw.startsWith("https://")
        ? raw
        : `${BACKEND_HOST}${proxyUrl || `/${raw.replace(/^\/+/, "")}`}`;

    try {
      const res = await fetch(directUrl, { headers: { Accept: "*/*" } });
      if (res.ok) {
        const type = res.headers.get("content-type") || "";
        if (!type.includes("html") && !type.includes("json")) {
          const blob = await res.blob();
          if (blob && blob.size > 0) return blob;
        }
      }
    } catch (e) {
      // Direct fetch failed
    }

    throw new Error(`Failed to fetch avatar blob for ${fileUrl}`);
  },

  /**
   * Fetch submission file as a Blob.
   *
   * @param {string} fileUrl - Full URL, relative path, or filename
   * @returns {Promise<Blob>}
   */
  async getSubmissionFileBlob(fileUrl) {
    const proxyUrl = buildFullUrl(fileUrl, "submissions");
    if (!proxyUrl && !fileUrl) {
      throw new Error("Submission file URL is required");
    }

    // Try 1: Local proxy via fetch without credentials (avoids CORS preflight)
    if (proxyUrl) {
      try {
        const res = await fetch(proxyUrl, { headers: { Accept: "*/*" } });
        if (res.ok) {
          const type = res.headers.get("content-type") || "";
          if (!type.includes("html") && !type.includes("json")) {
            const blob = await res.blob();
            if (blob && blob.size > 0) return blob;
          }
        }
      } catch (e) {
        // Fall through to next attempt
      }
    }

    // Try 2: Axios with token
    if (proxyUrl) {
      try {
        const response = await api.get(proxyUrl, {
          baseURL: "",
          responseType: "blob",
          headers: {
            Accept: "*/*",
          },
        });
        if (response.data && response.data.size > 0 && !response.data.type?.includes("html")) {
          return response.data;
        }
      } catch (err) {
        // Fall through to next attempt
      }
    }

    // Try 3: Direct backend URL
    const raw = String(fileUrl || proxyUrl || "").trim();
    const directUrl =
      raw.startsWith("http://") || raw.startsWith("https://")
        ? raw
        : `${BACKEND_HOST}${proxyUrl || `/${raw.replace(/^\/+/, "")}`}`;

    try {
      const res = await fetch(directUrl, { headers: { Accept: "*/*" } });
      if (res.ok) {
        const type = res.headers.get("content-type") || "";
        if (!type.includes("html") && !type.includes("json")) {
          const blob = await res.blob();
          if (blob && blob.size > 0) return blob;
        }
      }
    } catch (e) {
      // Direct fetch failed
    }

    throw new Error(`Failed to fetch submission file blob for ${fileUrl}`);
  },
};

export default avatarService;