<template>
    <div class="bg-white shadow-md rounded-lg p-4 mb-4 flex justify-between items-center">
        <div class="space-y-2">
            <label class="block text-gray-700 font-medium">IP: {{ ip }}</label>
            <label class="block text-gray-700 font-medium">Name: {{ name }}</label>
            <label class="block text-gray-700 font-medium">Port: {{ port }}</label>
        </div>

        <div class="flex space-x-2">
            <button
                @click="shutDownSensor"
                class="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
                Shut Down
            </button>
            <button
                @click="toggleModal"
                class="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
                Settings
            </button>
        </div>

        <SensorSettingsModal
            v-if="isModalVisible"
            :name="name"
            :days="days"
            :workingHours="workingHours"
            @close="toggleModal"
            @save="saveSettings"
        />
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import SensorSettingsModal from '@/components/modal/SensorSettingsModal.vue';
import {
    shutDownSensorApi,
    updateSensorCronJobDays,
    updateSensorCronJobTime,
    updateSensorName,
} from '@/apis/sensorRegistryApi';
import { getToken } from '@/utils/manageToken';
import { HttpStatusCode } from 'axios';
import { defineEmits } from 'vue';
import '@/assets/tailwind.css';
import { UPDATE_CRONJOB_DAYS, UPDATE_CRONJOB_TIME, UPDATE_NAME_ACTION } from '@/headers/sensorHeaders';

const emit = defineEmits(['removeSensor']);

const props = defineProps({
    ip: { type: String, default: '' },
    name: { type: String, default: '' },
    port: { type: Number, default: 0 },
});

const isModalVisible = ref(false);
const days = ref([]); // Assume this comes from the backend
const workingHours = ref({ hours: 0, minutes: 0 });

const toggleModal = () => {
    isModalVisible.value = !isModalVisible.value;
};

const saveSettings = async (newSettings: { [key: string]: string }) => {
    const action = newSettings.action;
    const token = getToken();
    switch (action) {
        case UPDATE_NAME_ACTION: {
            const response = await updateSensorName(token, props.ip, props.port, newSettings.name);
            if (response.status !== HttpStatusCode.Ok) {
                alert('Error');
            } else {
                location.reload();
            }
        }
        case UPDATE_CRONJOB_DAYS: {
            const response = await updateSensorCronJobDays(token, props.ip, props.port, newSettings.days);
            if (response.status !== HttpStatusCode.Ok) {
                alert('Error');
            } else {
                location.reload();
            }
        }
        case UPDATE_CRONJOB_TIME: {
            const response = await updateSensorCronJobTime(
                token,
                props.ip,
                props.port,
                newSettings.hour,
                newSettings.minute,
            );
            if (response.status !== HttpStatusCode.Ok) {
                alert('Error');
            } else {
                location.reload();
            }
        }
    }
};

const shutDownSensor = async () => {
    const response = await shutDownSensorApi(getToken(), props.ip, props.port);
    if (response.status === HttpStatusCode.Ok) {
        emit('removeSensor', { ip: props.ip, port: props.port });
    }
};
</script>
