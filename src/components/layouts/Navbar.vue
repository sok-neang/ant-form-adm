<template>
    <header class="app-navbar">
        <div class="container-fluid d-flex align-items-center justify-content-between h-100">
            <div class="d-flex align-items-center">
                <button type="button" class="sidebar-toggle" @click="layoutStore.toggleAside">
                    <i :class="layoutStore.isAsideOpen
                        ? 'bi bi-chevron-left'
                        : 'bi bi-chevron-right'
                        "></i>
                </button>
            </div>
            <!-- RIGHT -->
            <div class="d-flex align-items-center gap-3">
                <div class="welcome-text mx-4">
                    <span>សូមស្វាគមន៍</span>
                    <span class="welcome-hand">👋</span>
                </div>

            </div>
        </div>
    </header>
</template>


<script setup>
import { useLayoutStore } from "@/stores/layout";
const layoutStore = useLayoutStore();

</script>

