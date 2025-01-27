<template>
    <div class="relative">
        <button @click="toggleModal" class="p-2 rounded-full hover:bg-gray-100 relative">
            <i class="bell-icon">🔔</i>
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
