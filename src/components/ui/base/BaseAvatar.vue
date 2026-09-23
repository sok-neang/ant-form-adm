<template>
  <img
    :src="displaySrc || defaultAvatar"
    :alt="altText"
    :width="size"
    :height="size"
    :class="[roundedClass, 'object-fit-cover base-avatar-img', customClass]"
    :style="avatarStyle"
    @error="handleError"
  />
</template>

<script setup>
import { ref, watch, computed } from "vue";
import defaultAvatar from "@/assets/images/img/default_avatar.webp";
import { getAvatarUrl, DEFAULT_AVATAR } from "@/composable/useAvatar";

const props = defineProps({
  src: {
    type: [String, Object],
    default: null,
  },
  alt: {
    type: String,
    default: "User",
  },
  size: {
    type: [Number, String],
    default: 45,
  },
  customClass: {
    type: String,
    default: "",
  },
  roundedClass: {
    type: String,
    default: "rounded-circle",
  },
});

const displaySrc = ref(defaultAvatar);

const altText = computed(() => props.alt || "User");

const avatarStyle = computed(() => {
  const dimension = typeof props.size === "number" ? `${props.size}px` : props.size;
  return {
    width: dimension,
    height: dimension,
    minWidth: dimension,
    aspectRatio: "1 / 1",
  };
});

const extractPath = (val) => {
  if (!val) return null;
  if (typeof val === "object") {
    return (
      val.avatarPath ||
      val.avatarUrl ||
      val.avatar ||
      val.photoUrl ||
      val.filePath ||
      val.fileUrl ||
      null
    );
  }
  return typeof val === "string" ? val.trim() : null;
};

const resolveAvatar = async () => {
  const rawPath = extractPath(props.src);
  if (!rawPath) {
    displaySrc.value = defaultAvatar;
    return;
  }

  // Already a data URL or blob URL
  if (rawPath.startsWith("data:") || rawPath.startsWith("blob:")) {
    displaySrc.value = rawPath;
    return;
  }

  try {
    const url = await getAvatarUrl(rawPath);
    if (!url || url === DEFAULT_AVATAR) {
      displaySrc.value = defaultAvatar;
    } else {
      displaySrc.value = url;
    }
  } catch (err) {
    displaySrc.value = defaultAvatar;
  }
};

watch(
  () => props.src,
  () => {
    resolveAvatar();
  },
  { immediate: true, deep: true }
);

const handleError = (e) => {
  displaySrc.value = defaultAvatar;
  if (e?.target) {
    e.target.src = defaultAvatar;
  }
};
</script>

<style scoped>
.base-avatar-img {
  aspect-ratio: 1 / 1;
  flex-shrink: 0;
}
</style>
