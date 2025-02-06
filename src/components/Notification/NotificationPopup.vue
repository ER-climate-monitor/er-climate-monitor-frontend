<template>
    <button
        @click="emit('close-popup', notification.id)"
        class="absolute top-2 right-2 text-gray-400 hover:text-gray-600 transition-colors"
    >
        <span class="font-material-symbols text-sm">close</span>
    </button>

    <div class="text-blue-500">
        <span class="font-material-symbols text-gray-800">
            {{ getAlertIcon(notification.type) }}
        </span>
    </div>

    <div class="flex-1 min-w-0 pr-4">
        <div class="flex justify-between items-start">
            <h6 class="font-medium text-gray-900 truncate">
                {{ notification.sensorName }}
            </h6>
            <span class="text-xs text-gray-500">
                {{ formatShortDate(notification.timestamp) }}
            </span>
        </div>

        <p class="text-sm text-gray-600 mt-1">
            {{ notification.query.name }}: {{ notification.value }} {{ notification.unit }}
        </p>
    </div>
</template>
<script setup lang="ts">
import { getAlertIcon } from '@/stores/notificationStore';
import { formatShortDate } from '@/utils/mapUtils';
import { onMounted } from 'vue';

const props = defineProps({
    notification: {
        type: Object,
        required: true,
    },
});

const emit = defineEmits<{
    'close-popup': [id: string];
}>();

onMounted(() => {
    setTimeout(() => {
        emit('close-popup', props.notification.id);
    }, 5000);
});
</script>
