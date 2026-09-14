import api from '@/api/axios';

/**
 * Service to handle document exports (Shortlist & Final results).
 */
export const exportService = {
  /**
   * Fetch Shortlist export as a Blob
   * @param {Object} params - Query params { format, program, shift, groupSize, groupIndex, exportDate, startDate, endDate }
   */
  getShortlistExport(params = {}) {
    return api.get('/exports/shortlist', {
      params,
      responseType: 'blob',
    });
  },

  /**
   * Fetch Final Passed / Reserved export as a Blob
   * @param {Object} params - Query params { format, program, shift, exportDate }
   */
  getFinalExport(params = {}) {
    return api.get('/exports/final', {
      params,
      responseType: 'blob',
    });
  },
};

/**
 * Downloads exported Shortlist or Final list as a file.
 *
 * @param {'shortlist' | 'final'} type - Target export type
 * @param {Object} filters - Active filter state (e.g. { format: 'pdf', program, shift, ... })
 * @returns {Promise<{ success: boolean, filename?: string, error?: string }>}
 */
export async function downloadExportFile(type, filters = {}) {
  // Clean up empty parameters before sending
  const cleanParams = {};
  for (const [key, value] of Object.entries(filters)) {
    if (value !== undefined && value !== null && value !== '') {
      cleanParams[key] = value;
    }
  }

  // Ensure format is always present
  if (!cleanParams.format) {
    cleanParams.format = 'pdf';
  }

  try {
    const response = await (type === 'final'
      ? exportService.getFinalExport(cleanParams)
      : exportService.getShortlistExport(cleanParams));

    // 1. Extract suggested filename from Content-Disposition header
    let filename = `scholarship-${type}.${cleanParams.format === 'docx' ? 'docx' : 'pdf'}`;
    const disposition = response.headers?.['content-disposition'];
    if (disposition) {
      const match = disposition.match(/filename="?([^";]+)"?/i);
      if (match && match[1]) {
        filename = match[1];
      }
    }

    // 2. Create browser download link and trigger download
    const blob = new Blob([response.data], {
      type: response.headers?.['content-type'] || 'application/octet-stream',
    });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();

    // 3. Clean up memory
    link.remove();
    window.URL.revokeObjectURL(url);

    return { success: true, filename };
  } catch (error) {
    // When responseType is 'blob', Axios wraps backend error JSON in a Blob!
    let errorMessage = 'Failed to export document.';

    if (error.response?.data instanceof Blob) {
      try {
        const errorText = await error.response.data.text();
        const parsed = JSON.parse(errorText);
        errorMessage = parsed.message || errorMessage;
      } catch {
        errorMessage = `Error (${error.response.status}): ${error.response.statusText}`;
      }
    } else if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    }

    console.error('[Export Error]', errorMessage);
    throw new Error(errorMessage);
  }
}

export default exportService;
