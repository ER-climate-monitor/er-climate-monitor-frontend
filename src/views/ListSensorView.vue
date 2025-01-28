<template>
    <div class="w-[1000px]">
        <div id="search-engine" class="pb-10">
            <label class="text-lg font-small text-gray-900" for="input-name"> Search: </label>
            <input
                id="input-name"
                type="text"
                v-model="searchQuery"
                placeholder="Search a sensor"
                class="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
            />
            <div id="radio-filters" class="bg-white rounded-md">
                <h3 class="font-bold text-gray-900 text-center">Filters:</h3>
                <ul class="list-none mt-2">
                    <li v-for="filter in filters" :key="filter" class="mb-2 flex items-center gap-2 cursor-pointer">
                        <label
                            class="text-lg font-medium text-gray-900 mt-4 block"
                            :for="'radio-button-' + filter"
                        ></label>
                        <input
                            type="radio"
                            :id="'radio-button-' + filter"
                            :value="filter"
                            v-model="selectedFilter"
                            name="search-group"
                            class="cursor-pointer"
                        />
                        <label :for="'radio-button-' + filter" class="text-gray-800 cursor-pointer">
                            {{ filter }}
                        </label>
                    </li>
                </ul>
            </div>
        </div>
        <div id="sensor list" class="sensor-list w-100">
            <ul class="overflow-auto">
                <li v-for="sensor in displayedSensor" :key="sensor.ip">
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
import { ref, onMounted, watch, type Ref } from 'vue';
import { getToken } from '@/utils/manageToken';
import { BasicSensor, type Sensor } from '@/models/sensorModel';
const sensors: Ref<Array<Sensor>> = ref([]);
const displayedSensor: Ref<Array<Sensor>> = ref([]);
const searchQuery = ref('');
const filters = ['ip', 'port', 'name'];
const selectedFilter = filters[0];

onMounted(async () => {
    const token = getToken();
    const response = await getAllSensors(token);
    response.data.sensors.forEach((element: Sensor) => {
        sensors.value.push(new BasicSensor(element.ip, String(element.port), element.name || 'unknown'));
        displayedSensor.value.push(new BasicSensor(element.ip, String(element.port), element.name || 'unknown'));
    });
});

const removeSensorFromList = (sensorToRemove: { ip: string; port: string }) => {
    sensors.value = sensors.value.filter(
        (sensor) => sensor.ip !== sensorToRemove.ip || sensor.port !== sensorToRemove.port,
    );
};

const filterSensors = () => {
    switch (selectedFilter.toLowerCase()) {
        case 'ip': {
            return sensors.value.filter((sensor) => sensor.ip.includes(searchQuery.value, 0));
        }
        case 'port': {
            return sensors.value.filter((sensor) => sensor.port.includes(searchQuery.value, 0));
        }
        case 'name': {
            return sensors.value.filter((sensor) => sensor.name.includes(searchQuery.value, 0));
        }
        default: {
            return [];
        }
    }
};

watch(searchQuery, () => {
    if (searchQuery.value === '') {
        displayedSensor.value = sensors.value;
        return;
    }
    displayedSensor.value = filterSensors();
});
</script>
