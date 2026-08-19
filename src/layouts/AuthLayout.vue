<script setup>
defineProps({
  title: {
    type: String,
    default: "",
  },
});
</script>

<template>
  <div class="auth-layout">
    <div class="row g-0 min-vh-100">

      <!-- LEFT SECTION -->
      <div class="col-lg-6 auth-left">
        <slot name="left" />
      </div>

      <!-- RIGHT SECTION -->
      <div class="col-lg-6 auth-right">
        <div class="auth-content">
          <slot />
        </div>
      </div>

    </div>
  </div>
</template>

<style scoped>
.auth-layout {
  min-height: 100vh;
  width: 100%;
}

.auth-left {
  min-height: 100vh;
  overflow: hidden;
}

.auth-right {
  min-height: 100vh;

  display: flex;
  align-items: center;
  justify-content: center;

  background: #ffffff;

  padding: 40px;
}

.auth-content {
  width: 100%;
  max-width: 450px;
}

/* LEFT IMAGE */

.auth-image {
  position: relative;

  width: 100%;
  height: 100vh;
}

.auth-image img {
  width: 100%;
  height: 100%;

  object-fit: cover;
}

/* IMAGE OVERLAY */

.auth-image-overlay {
  position: absolute;

  inset: 0;

  display: flex;
  flex-direction: column;

  align-items: center;
  justify-content: center;

  padding: 40px;

  text-align: center;

  color: #ffffff;

  background: rgba(0, 0, 0, 0.35);
}

/* MOBILE */

@media (max-width: 991.98px) {
  .auth-left {
    display: none;
  }

  .auth-right {
    min-height: 100vh;
    padding: 24px;
  }
}
</style>