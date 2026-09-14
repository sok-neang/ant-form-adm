import api from "@/api/axios";

/**
 * Service for fetching protected files from the backend.
 *
 * The backend must provide the full fileUrl, for example:
 * https://ant-form-backend.g2.ant.com.kh/uploads/submissions/file.pdf
 */
const BACKEND_BASE_URL = "https://ant-form-backend.g2.ant.com.kh";

function buildFullUrl(fileUrl, defaultFolder = "avatars") {
  if (!fileUrl) return "";
  let url = String(fileUrl).trim();
  if (url.startsWith("data:") || url.startsWith("blob:")) {
    return url;
  }
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }

  const clean = url.replace(/^\/+/, "");
  if (clean.startsWith("uploads/")) {
    return `${BACKEND_BASE_URL}/${clean}`;
  }
  if (clean.startsWith(`${defaultFolder}/`)) {
    return `${BACKEND_BASE_URL}/uploads/${clean}`;
  }
  return `${BACKEND_BASE_URL}/uploads/${defaultFolder}/${clean}`;
}

const avatarService = {
  /**
   * Fetch avatar as a Blob.
   *
   * @param {string} fileUrl - Full URL, relative path, or filename
   * @returns {Promise<Blob>}
   */
  async getAvatarBlob(fileUrl) {
    if (!fileUrl) {
      throw new Error("Avatar file URL is required");
    }

    const url = buildFullUrl(fileUrl, "avatars");
    const response = await api.get(url, {
      responseType: "blob",
    });

    return response.data;
  },

  /**
   * Fetch submission file as a Blob.
   *
   * @param {string} fileUrl - Full URL, relative path, or filename
   * @returns {Promise<Blob>}
   */
  async getSubmissionFileBlob(fileUrl) {
    if (!fileUrl) {
      throw new Error("Submission file URL is required");
    }

    const url = buildFullUrl(fileUrl, "submissions");
    const response = await api.get(url, {
      responseType: "blob",
    });

    return response.data;
  },
};

export default avatarService;