<template>
    <div class="fixed top-4 right-4 z-50 flex flex-col gap-2 items-end">
        <TransitionGroup name="notification" tag="div" class="flex flex-col gap-2">
            <div
                v-for="notification in activePopups"
                :key="notification.id"
                class="bg-white shadow-lg rounded-lg p-4 w-80 transform transition-all duration-300 flex items-start gap-3 border border-gray-200 relative"
            >
                <NotificationPopup :notification="notification" @close-popup="handlePopupClose" />
            </div>
        </TransitionGroup>
    </div>
</template>
<script setup lang="ts">
import { useNotificationState } from '@/stores/notificationStore';
import NotificationPopup from '@/components/Notification/NotificationPopup.vue';

const { activePopups, removeNotificationPopup } = useNotificationState();

const handlePopupClose = (id: string) => {
    removeNotificationPopup(id);
};
</script>
