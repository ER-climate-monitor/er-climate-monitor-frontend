<script setup lang="ts">
import './assets/tailwind.css';
import NavBar from '@/components/NavBar/NavBar.vue';
</script>

<template>
    <div class="flex flex-col min-h-screen">
        <NavBar />
        <RouterView class="flex-grow" />
    </div>
</template>
