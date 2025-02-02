<script setup lang="ts">
import { useNotificationState } from '@/stores/notificationStore';
import { getAlertIcon } from '@/stores/notificationStore';

const { activePopups } = useNotificationState();
</script>

<template>
    <div class="fixed top-4 right-4 z-50 flex flex-col gap-2 items-end">
        <TransitionGroup name="notification" tag="div" class="flex flex-col gap-2">
            <div
                v-for="notification in activePopups"
                :key="notification.id"
                class="bg-white shadow-lg rounded-lg p-4 w-80 transform transition-all duration-300 flex items-start gap-3 border border-gray-200"
            >
                <div class="text-blue-500">
                    <span class="font-material-symbols text-gray-800">
                        {{ getAlertIcon(notification.type) }}
                    </span>
                </div>

                <div class="flex-1 min-w-0">
                    <div class="flex justify-between items-start">
                        <h6 class="font-medium text-gray-900 truncate">
                            {{ notification.sensorName }}
                        </h6>
                        <span class="text-xs text-gray-500">
                            {{ notification.timestamp }}
                        </span>
                    </div>

                    <p class="text-sm text-gray-600 mt-1">
                        {{ notification.query.name }}: {{ notification.value }} {{ notification.unit }}
                    </p>
                </div>
            </div>
        </TransitionGroup>
    </div>
</template>
