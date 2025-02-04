<template>
    <div class="bg-white shadow-md rounded-lg p-4 mb-4 w-full justify-between items-center hover:bg-gray-200">
        <div id="sensor-information" class="space-y-2">
            <h3 class="block text-gray-700 font-medium">IP: {{ ip }}</h3>
            <h3 for="sensor-information" class="block text-gray-700 font-medium">Name: {{ name }}</h3>
            <h3 class="block text-gray-700 font-medium">Port: {{ port }}</h3>
        </div>

        <div class="flex space-x-2">
            <button
                @click="showConfirmModal"
                class="bg-secondary text-white px-4 py-2 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
                Shut Down
            </button>
            <button
                @click="toggleModal"
                class="bg-primary text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
                Settings
            </button>
        </div>

        <SensorSettingsModal
            v-if="isModalVisible"
            :name="name"
            :workingHours="workingHours"
            @close="toggleModal"
            @save="saveSettings"
        />
    </div>

    <ConfirmationModal v-if="isConfirmModalVisible" @cancel="hideConfirmModal" @confirm="shutDownSensor" />
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
import router from '@/router';
import ConfirmationModal from '../modal/ConfirmationModal.vue';

const emit = defineEmits(['removeSensor', 'updateSensorName']);

const props = defineProps({
    ip: { type: String, default: '' },
    name: { type: String, default: '' },
    port: { type: String, default: '' },
});

const isModalVisible = ref(false);
const isConfirmModalVisible = ref(false);
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
            if (response.status === HttpStatusCode.Unauthorized) {
                router.push('/login');
            } else {
                emit('updateSensorName', { ip: props.ip, port: props.port, name: newSettings.name });
            }
            return;
        }
        case UPDATE_CRONJOB_DAYS: {
            const response = await updateSensorCronJobDays(token, props.ip, props.port, newSettings.days);
            if (response.status === HttpStatusCode.Unauthorized) {
                router.push('/login');
            }
            return;
        }
        case UPDATE_CRONJOB_TIME: {
            const response = await updateSensorCronJobTime(
                token,
                props.ip,
                props.port,
                newSettings.hour,
                newSettings.minute,
            );
            if (response.status !== HttpStatusCode.Unauthorized) {
                router.push('/login');
            }
            return;
        }
    }
};

const hideConfirmModal = () => {
    isConfirmModalVisible.value = false;
};

const showConfirmModal = () => {
    isConfirmModalVisible.value = true;
};

const shutDownSensor = async () => {
    const response = await shutDownSensorApi(getToken(), props.ip, props.port);
    if (response.status === HttpStatusCode.Ok) {
        emit('removeSensor', { ip: props.ip, port: props.port });
    }
    hideConfirmModal();
};
</script>
