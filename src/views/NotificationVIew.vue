<template>
  <div class="relative">
    <button @click="toggleModal" class="p-2 rounded-full hover:bg-gray-100 relative">
      <i class="bell-icon">🔔</i>
      <span
        v-if="unreadCount > 0"
        class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
      >
        {{ unreadCount }}
      </span>
      <NotificationModal v-if="isModalOpen" @close="toggleModal" :notifications="notifications" />
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { type Notification } from '@/stores/notificationStore';
import NotificationModal from '../components/Notification/NotificationModal.vue';

const notifications = ref<Notification[]>([]);
const isModalOpen = ref(false);
const toggleModal = () => {
  isModalOpen.value = !isModalOpen.value;
};

const unreadCount = computed(() => notifications.value.filter((n) => !n.read).length);
</script>
