<template>
  <div class="document-viewer-page d-flex flex-column vh-100 overflow-hidden bg-dark text-white">
    <!-- Top Navigation Toolbar -->
    <header class="viewer-toolbar d-flex align-items-center justify-content-between px-3 py-2 bg-black border-bottom border-secondary border-opacity-25 flex-shrink-0">
      <!-- Left: Title & File info -->
      <div class="d-flex align-items-center gap-2 min-w-0 me-3">
        <i
          :class="isPdf ? 'bi bi-file-earmark-pdf-fill text-danger' : 'bi bi-file-earmark-image-fill text-primary'"
          class="fs-4 flex-shrink-0"
        ></i>
        <div class="text-truncate">
          <h6 class="mb-0 text-white text-truncate fw-semibold" :title="documentTitle">
            {{ documentTitle }}
          </h6>
          <span v-if="pageCount > 0" class="text-secondary small">
            ទំព័រ {{ currentPage }} នៃ {{ pageCount }}
          </span>
        </div>
      </div>

      <!-- Center: Zoom & Page Controls (for PDF) -->
      <div v-if="isPdf && !isLoading && !errorMessage" class="d-flex align-items-center gap-2 flex-shrink-0">
        <!-- Page navigation if multiple pages -->
        <div v-if="pageCount > 1" class="d-flex align-items-center gap-1 bg-secondary bg-opacity-25 rounded px-2 py-1">
          <button
            class="btn btn-sm btn-link text-white p-0"
            :disabled="currentPage <= 1"
            @click="currentPage--"
            title="ទំព័រមុន"
          >
            <i class="bi bi-chevron-left"></i>
          </button>
          <span class="small px-2">{{ currentPage }} / {{ pageCount }}</span>
          <button
            class="btn btn-sm btn-link text-white p-0"
            :disabled="currentPage >= pageCount"
            @click="currentPage++"
            title="ទំព័របន្ទាប់"
          >
            <i class="bi bi-chevron-right"></i>
          </button>
        </div>

        <!-- Zoom controls -->
        <div class="d-flex align-items-center gap-1 bg-secondary bg-opacity-25 rounded px-1">
          <button
            class="btn btn-sm btn-link text-white p-1"
            :disabled="zoomScale <= 0.6"
            @click="zoomOut"
            title="បង្រួម (Zoom Out)"
          >
            <i class="bi bi-dash-lg"></i>
          </button>
          <span class="small px-1 text-center" style="min-width: 48px;">
            {{ Math.round(zoomScale * 100) }}%
          </span>
          <button
            class="btn btn-sm btn-link text-white p-1"
            :disabled="zoomScale >= 2.5"
            @click="zoomIn"
            title="ពង្រីក (Zoom In)"
          >
            <i class="bi bi-plus-lg"></i>
          </button>
          <button
            class="btn btn-sm btn-link text-secondary p-1 ms-1"
            @click="resetZoom"
            title="កំណត់ពង្រីកឡើងវិញ (100%)"
          >
            <i class="bi bi-aspect-ratio"></i>
          </button>
        </div>
      </div>

      <!-- Right: Action Buttons -->
      <div class="d-flex align-items-center gap-2 flex-shrink-0">
        <button
          v-if="rawBlob"
          type="button"
          class="btn btn-sm btn-outline-light d-inline-flex align-items-center gap-1"
          @click="printDocument"
          title="បោះពុម្ព (Print)"
        >
          <i class="bi bi-printer"></i>
          <span class="d-none d-md-inline">បោះពុម្ព</span>
        </button>
        <button
          v-if="rawBlob"
          type="button"
          class="btn btn-sm btn-primary d-inline-flex align-items-center gap-1"
          @click="downloadDocument"
          title="ទាញយក (Download)"
        >
          <i class="bi bi-download"></i>
          <span class="d-none d-md-inline">ទាញយក</span>
        </button>
        <button
          type="button"
          class="btn btn-sm btn-outline-secondary text-white"
          @click="closeTab"
          title="បិទផ្ទាំងនេះ"
        >
          <i class="bi bi-x-lg"></i>
        </button>
      </div>
    </header>

    <!-- Main Content Area -->
    <main class="viewer-body flex-grow-1 overflow-auto position-relative d-flex justify-content-center align-items-start p-3 p-md-4">
      <!-- Loading State -->
      <div v-if="isLoading" class="d-flex flex-column align-items-center justify-content-center m-auto py-5">
        <div class="spinner-border text-primary mb-3" role="status" style="width: 3rem; height: 3rem;">
          <span class="visually-hidden">Loading...</span>
        </div>
        <p class="text-white fw-medium fs-5">កំពុងដំណើរការផ្ទុកឯកសារ...</p>
        <span class="text-secondary small">សូមរង់ចាំបន្តិច</span>
      </div>

      <!-- Error State -->
      <div v-else-if="errorMessage" class="card bg-dark border border-danger border-opacity-50 text-white rounded-4 p-4 text-center m-auto shadow" style="max-width: 500px;">
        <div class="text-danger mb-3">
          <i class="bi bi-exclamation-triangle-fill fs-1"></i>
        </div>
        <h5 class="fw-bold mb-2">មិនអាចបើកមើលឯកសារបានទេ</h5>
        <p class="text-secondary mb-4">{{ errorMessage }}</p>
        <div class="d-flex justify-content-center gap-2">
          <button class="btn btn-primary px-4" @click="loadFile">
            <i class="bi bi-arrow-clockwise me-1"></i> ព្យាយាមម្តងទៀត
          </button>
          <button class="btn btn-outline-secondary text-white" @click="closeTab">
            បិទ
          </button>
        </div>
      </div>

      <!-- PDF Display -->
      <div
        v-else-if="isPdf && pdfSource"
        class="pdf-display-container d-flex flex-column align-items-center my-2"
        :style="{ transform: `scale(${zoomScale})`, transformOrigin: 'top center', transition: 'transform 0.15s ease-out' }"
      >
        <VuePdfEmbed
          :source="pdfSource"
          :page="pageCount > 1 ? currentPage : undefined"
          annotation-layer
          text-layer
          class="pdf-embed-surface bg-white shadow-lg rounded-2"
          @loaded="onPdfLoaded"
          @loading-failed="onPdfFailed"
        />
      </div>

      <!-- Image Display -->
      <div
        v-else-if="isImage && imageUrl"
        class="image-display-container d-flex align-items-center justify-content-center m-auto"
        :style="{ transform: `scale(${zoomScale})`, transformOrigin: 'center center', transition: 'transform 0.15s ease-out' }"
      >
        <img
          :src="imageUrl"
          :alt="documentTitle"
          class="img-fluid rounded-3 shadow-lg"
          style="max-height: 85vh; max-width: 90vw; object-fit: contain;"
        />
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useRoute } from "vue-router";
import VuePdfEmbed from "vue-pdf-embed";
import "vue-pdf-embed/dist/styles/annotationLayer.css";
import "vue-pdf-embed/dist/styles/textLayer.css";
import avatarService from "@/services/avatar.service";

const route = useRoute();

const rawFilePath = ref("");
const documentTitle = ref("ឯកសារភ្ជាប់");
const isLoading = ref(true);
const errorMessage = ref("");
const rawBlob = ref(null);

const pdfSource = ref(null);
const imageUrl = ref(null);
const isPdf = ref(true);
const isImage = ref(false);

const zoomScale = ref(1.0);
const currentPage = ref(1);
const pageCount = ref(0);

const zoomIn = () => {
  if (zoomScale.value < 2.5) {
    zoomScale.value = Math.min(2.5, +(zoomScale.value + 0.15).toFixed(2));
  }
};

const zoomOut = () => {
  if (zoomScale.value > 0.6) {
    zoomScale.value = Math.max(0.6, +(zoomScale.value - 0.15).toFixed(2));
  }
};

const resetZoom = () => {
  zoomScale.value = 1.0;
};

const onPdfLoaded = (pdf) => {
  if (pdf && pdf.numPages) {
    pageCount.value = pdf.numPages;
  }
};

const onPdfFailed = (err) => {
  console.error("VuePdfEmbed failed in viewer:", err);
  errorMessage.value = "មិនអាចបង្ហាញទិន្នន័យឯកសារ PDF បានឡើយ។";
};

const loadFile = async () => {
  isLoading.value = true;
  errorMessage.value = "";
  pdfSource.value = null;
  if (imageUrl.value) {
    URL.revokeObjectURL(imageUrl.value);
    imageUrl.value = null;
  }

  const fileParam = String(route.query.file || "").trim();
  const titleParam = String(route.query.title || "").trim();

  if (titleParam) {
    documentTitle.value = titleParam;
    document.title = `${titleParam} | ANT Document Viewer`;
  }

  if (!fileParam) {
    errorMessage.value = "មិនមានតំណភ្ជាប់ឯកសារដែលត្រូវបើកមើលទេ។";
    isLoading.value = false;
    return;
  }

  rawFilePath.value = fileParam;
  const lower = fileParam.toLowerCase().split("?")[0];
  isPdf.value = lower.endsWith(".pdf") || lower.includes(".pdf");
  isImage.value = /\.(jpe?g|png|webp|gif|bmp|svg)$/i.test(lower);

  try {
    // Fetch blob with authenticated session
    const blob = await avatarService.getSubmissionFileBlob(fileParam);
    if (!blob || blob.size === 0) {
      throw new Error("Empty file received from server");
    }

    rawBlob.value = blob;

    // Detect MIME type if not clear from extension
    if (blob.type === "application/pdf" || blob.type.includes("pdf")) {
      isPdf.value = true;
      isImage.value = false;
    } else if (blob.type.startsWith("image/")) {
      isImage.value = true;
      isPdf.value = false;
    }

    if (isPdf.value) {
      const buffer = await blob.arrayBuffer();
      pdfSource.value = new Uint8Array(buffer);
    } else {
      imageUrl.value = URL.createObjectURL(blob);
    }
  } catch (err) {
    console.error("Failed to load document:", err);
    errorMessage.value =
      err?.response?.data?.message ||
      err?.message ||
      "មិនមានសិទ្ធិមើលឯកសារនេះ ឬឯកសារមិនត្រូវបានរកឃើញលើប្រព័ន្ធ។";
  } finally {
    isLoading.value = false;
  }
};

const printDocument = () => {
  if (!rawBlob.value) return;
  const blobUrl = URL.createObjectURL(rawBlob.value);
  const iframe = document.createElement("iframe");
  iframe.style.position = "fixed";
  iframe.style.right = "0";
  iframe.style.bottom = "0";
  iframe.style.width = "0";
  iframe.style.height = "0";
  iframe.style.border = "none";
  iframe.src = blobUrl;
  document.body.appendChild(iframe);
  iframe.onload = () => {
    setTimeout(() => {
      try {
        iframe.focus();
        iframe.contentWindow.print();
      } catch (e) {
        window.print();
      }
    }, 250);
  };
};

const downloadDocument = () => {
  if (!rawBlob.value) return;
  const blobUrl = URL.createObjectURL(rawBlob.value);
  const a = document.createElement("a");
  a.href = blobUrl;
  const ext = isPdf.value ? ".pdf" : "";
  let name = documentTitle.value || "document";
  if (ext && !name.toLowerCase().endsWith(ext)) {
    name += ext;
  }
  a.download = name;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
};

const closeTab = () => {
  window.close();
};

onMounted(() => {
  loadFile();
});

onUnmounted(() => {
  if (imageUrl.value) {
    URL.revokeObjectURL(imageUrl.value);
  }
});
</script>

<style scoped>
.document-viewer-page {
  background-color: #1e222d;
  color: #e2e8f0;
}

.viewer-toolbar {
  height: 56px;
  background-color: #12151c;
  z-index: 10;
}

.viewer-body {
  background-color: #272c38;
}

.pdf-embed-surface {
  min-width: 600px;
  max-width: 960px;
  width: 100%;
}

@media (max-width: 768px) {
  .pdf-embed-surface {
    min-width: 100%;
  }
}
</style>
