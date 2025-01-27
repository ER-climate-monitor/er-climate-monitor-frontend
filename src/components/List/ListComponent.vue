<template>
    <div class="sensor-item">
        <!-- Sensor Information -->
        <div class="sensor-info">
            <label class="sensor-label">IP: {{ ip }}</label>
            <label class="sensor-label">Name: {{ name }}</label>
            <label class="sensor-label">Port: {{ port }}</label>
        </div>

        <div class="sensor-actions">
            <button @click="shutDownSensor" class="action-button shut-off">Shut Down</button>
            <button @click="toggleModal" class="action-button settings">Settings</button>
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
import { shutDownSensorApi } from '@/apis/sensorRegistryApi';
import { getToken } from '@/utils/manageToken';
import { HttpStatusCode } from 'axios';
import { defineEmits } from 'vue';
import { UPDATE_CRONJOB_DAYS, UPDATE_NAME_ACTION } from '@/headers/sensorHeaders';

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

const saveSettings = (newSettings: { [key: string]: string }) => {
    const action = newSettings.action;
    switch (action) {
        case UPDATE_NAME_ACTION: {
            console.log(newSettings.name);
        }
        case UPDATE_CRONJOB_DAYS: {
            console.log(newSettings.days);
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

<style scoped>
.sensor-item {
    display: flex;
    flex-direction: column;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    margin: 10px 0;
}

.sensor-info {
    margin-bottom: 10px;
}

.sensor-label {
    display: block;
    font-size: 14px;
    color: #333;
}

.sensor-actions {
    display: flex;
    gap: 10px;
}

.action-button {
    padding: 5px 10px;
    font-size: 14px;
    border: none;
    border-radius: 3px;
    cursor: pointer;
}

.action-button.shut-off {
    background-color: #ff4d4d;
    color: white;
}

.action-button.settings {
    background-color: #4d79ff;
    color: white;
}
</style>
