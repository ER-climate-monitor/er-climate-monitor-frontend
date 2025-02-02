<template>
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div class="bg-white rounded-lg p-6 w-full max-w-xl">
            <div class="flex justify-between mb-4">
                <div class="flex items-center gap-3">
                    <span class="font-material-symbols text-2xl text-gray-900">{{ getAlertIcon(alert.type) }}</span>
                    <h2 class="text-xl font-bold text-gray-900">Sensor: <i>{{ alert.sensorName }}</i></h2>
                </div>
                <button @click="$emit('close')" class="text-gray-500 text-2xl"><span class="text-2xl font-material-symbols">close</span></button>
            </div>

            <div class="prose">
                <p class="text-lg mb-4 text-gray-900">Current value: {{ alert.value }} ({{ alert.unit }})</p>
                <div class="bg-gray-100 p-4 rounded">
                    <h3 class="font-bold mb-2 text-gray-900">Full Description</h3>
                    <p class="text-gray-900">
                      The sensor of "<i>{{ alert.sensorName }}</i>", which monitors climate events of type {{ alert.type}},
                      has registered a value equals to {{ alert.value }} {{ alert.unit }}. The alert has been triggered
                      for query <i class="font-bold">{{ alert.query.name }}</i>, which is registered for a value of {{ alert.query.value }} {{ alert.unit }}.
                    </p>
                </div>

                <div class="mt-4 text-sm text-gray-500">Received: {{ new Date(alert.timestamp).toLocaleString() }}</div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { getAlertIcon } from '@/stores/notificationStore';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const props = defineProps({
    alert: {
        type: Object,
        required: true,
    },
});
</script>
