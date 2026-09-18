<template>
    <div class="col-xl-4 col-md-6">
        <div class="card border-1 border-primary rounded-4 h-100">
            <div class="card-body p-3">
                <!-- Icon + Badge -->
                <slot></slot>
            </div>
        </div>
    </div>
</template>
<script setup>
</script>
<style scoped>
.info-icon {
    width: 48px;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 12px;
    font-size: 22px;
}
</style>