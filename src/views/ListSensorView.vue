<template>
    <div>
        <div id="search-engine" class="pb-10">
            <label class="text-lg font-small text-gray-900" for="input-name"> Name: </label>
            <input
                id="input-name"
                type="text"
                v-model="searchQuery"
                placeholder="Search a sensor"
                class="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
            />
            <label class="text-lg font-small text-gray-900"> Filter: </label>
        </div>
        <div id="sensor list" class="sensor-list">
            <ul class="overflow-auto">
                <li v-for="sensor in sensors" :key="sensor.ip">
                    <SensorItem
                        :ip="sensor.ip"
                        :port="sensor.port"
                        :name="sensor.name"
                        @removeSensor="removeSensorFromList"
                    />
                </li>
            </ul>
        </div>
    </div>
</template>

<script setup lang="ts">
import SensorItem from '@/components/List/ListComponent.vue';
import { getAllSensors } from '@/apis/sensorRegistryApi';
import { ref, onMounted, type Ref } from 'vue';
import { getToken } from '@/utils/manageToken';
import { BasicSensor, type Sensor } from '@/models/sensorModel';
const sensors: Ref<Array<Sensor>> = ref([]);
const searchQuery = ref('');

onMounted(async () => {
    const token = getToken();
    const response = await getAllSensors(token);
    response.data.sensors.forEach((element: Sensor) => {
        sensors.value.push(new BasicSensor(element.ip, element.port, element.name || 'unknown'));
    });
});

const removeSensorFromList = (sensorToRemove: { ip: string; port: number }) => {
    sensors.value = sensors.value.filter(
        (sensor) => sensor.ip !== sensorToRemove.ip || sensor.port !== sensorToRemove.port,
    );
};
</script>
