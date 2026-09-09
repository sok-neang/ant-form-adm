import api from "@/api/axios";

/**
 * Service to fetch protected avatar files with Authorization headers.
 */
const avatarService = {
  /**
   * Fetch an avatar image as a Blob with authorization header.
   * @param {string} path - Filename (e.g. 'default-avatar.jpg'), relative path, or full hosting URL
   * @returns {Promise<Blob>}
   */
  async getAvatarBlob(path) {
    if (!path) {
      throw new Error("Avatar path is required");
    }

    // Extract filename if full path or URL was passed
    let filename = path;
    if (filename.includes("/")) {
      filename = filename.split("/").pop();
    }

    // Strip any query strings if present
    filename = filename.split("?")[0];

    // Build URL:
    // In dev: /uploads/avatars/... proxies to hosting URL
    // If VITE_API_BASE_URL is a full URL (e.g. https://.../api), use its origin
    let uploadUrl = `/uploads/avatars/${encodeURIComponent(filename)}`;
    const envBase = import.meta.env.VITE_API_BASE_URL || "";
    if (envBase.startsWith("http://") || envBase.startsWith("https://")) {
      try {
        const origin = new URL(envBase).origin;
        uploadUrl = `${origin}/uploads/avatars/${encodeURIComponent(filename)}`;
      } catch (_) {}
    }

    // Request via Axios with baseURL: "" so it hits the uploadUrl directly
    // The api interceptor will automatically attach Authorization: Bearer <accessToken>
    const response = await api.get(uploadUrl, {
      baseURL: "",
      responseType: "blob",
    });

    return response.data;
  },

  /**
   * Fetch a protected submission file (student photo, transcript) as a Blob with authorization header.
   * @param {string} path - Filename (e.g. '1788618970539-23b4197778603645.jpg'), relative path, or full hosting URL
   * @returns {Promise<Blob>}
   */
  async getSubmissionFileBlob(path) {
    if (!path) {
      throw new Error("Submission file path is required");
    }

    let filename = path;
    if (filename.includes("/")) {
      filename = filename.split("/").pop();
    }
    filename = filename.split("?")[0];

    let uploadUrl = `/uploads/submissions/${encodeURIComponent(filename)}`;
    const envBase = import.meta.env.VITE_API_BASE_URL || "";
    if (envBase.startsWith("http://") || envBase.startsWith("https://")) {
      try {
        const origin = new URL(envBase).origin;
        uploadUrl = `${origin}/uploads/submissions/${encodeURIComponent(filename)}`;
      } catch (_) {}
    }

    const response = await api.get(uploadUrl, {
      baseURL: "",
      responseType: "blob",
    });

    return response.data;
  },
};

export default avatarService;
