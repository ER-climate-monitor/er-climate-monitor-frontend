<template>
    <div class="relative">
        <button @click="toggleModal" class="p-2 rounded-full hover:bg-gray-700 relative">
            <span class="font-material-symbols text-3xl"> notifications </span>
            <NotificationModal v-if="isModalOpen" @close="toggleModal" :notifications="notifications" />
        </button>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { type Notification } from '@/stores/notificationStore';
import NotificationModal from '../components/Notification/NotificationModal.vue';

const notifications = ref<Notification[]>([]);
const isModalOpen = ref(false);
const toggleModal = () => {
    isModalOpen.value = !isModalOpen.value;
};
</script>
