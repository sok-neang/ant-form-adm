<template>
  <div class="auth-layout">
    <div class="row g-0 min-vh-100">
      <!-- LEFT -->
      <div class="col-lg-6 auth-left">
        <slot name="left" />
      </div>
      <!-- RIGHT -->
      <div class="col-lg-6 auth-right">
        <div class="auth-content">
          <slot />
        </div>
      </div>
    </div>
  </div>
</template>
