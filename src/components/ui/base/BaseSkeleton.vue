<template>
    <div
        class="skeleton"
        :class="[
        `skeleton-${variant}`,
        { 'is-circle': circle }
        ]"
        :style="{
        width,
        height,
        borderRadius: circle ? '50%' : radius
        }"
    >
    </div>
</template>

<script setup>
    defineProps({
    width: {
        type: String,
        default: "100%"
    },

    height: {
        type: String,
        default: "20px"
    },

    radius: {
        type: String,
        default: "10px"
    },

    variant: {
        type: String,
        default: "default"
    },

    circle: {
        type: Boolean,
        default: false
    }
    });
</script>

<style scoped>
.skeleton {
  position: relative;
  overflow: hidden;

  /* Modern soft background */
  background: linear-gradient(
    90deg,
    #eef1f5 0%,
    #f1f1f3 40%,
    #edf1f7 80%
  );

  background-size: 200% 100%;

  animation: skeleton-shimmer 1.6s ease-in-out infinite;

  flex-shrink: 0;
}

/* Shimmer */
@keyframes skeleton-shimmer {
  0% {
    background-position: 200% 0;
  }

  100% {
    background-position: -200% 0;
  }
}

/* Circle */
.is-circle {
  aspect-ratio: 1 / 1;
}

/* Text */
.skeleton-text {
  height: 14px;
  border-radius: 6px;
}

/* Title */
.skeleton-title {
  height: 24px;
  border-radius: 7px;
}

/* Button */
.skeleton-button {
  height: 40px;
  border-radius: 10px;
}

/* Dark mode */
:global(.dark) .skeleton {
  background: linear-gradient(
    90deg,
    #252a32 0%,
    #343a44 40%,
    #252a32 80%
  );

  background-size: 200% 100%;
}
</style>