<template>
    <div class="space-y-4">
        <div class="max-h-[640px] overflow-y-auto pr-2">
            <div class="space-y-4">
                <div
                    v-for="alert in notifications"
                    :key="alert.id"
                    @click="$emit('view-details', alert)"
                    class="p-4 border rounded cursor-pointer hover:bg-gray-50"
                >
                    <div class="flex items-center gap-3">
                        <div class="text-2xl">
                            <span class="font-material-symbols text-gray-800">
                                {{ getAlertIcon(alert.type) }}
                            </span>
                        </div>
                        <div>
                            <p class="text-gray-600">{{ `${alert.type}.${alert.sensorName}.${alert.query.name}` }}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { type Notification, getAlertIcon } from '@/stores/notificationStore';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const props = defineProps({
    notifications: {
        type: Array<Notification>,
        required: true,
    },
});
</script>
