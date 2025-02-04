<template>
    <div class="w-full max-w-3xl mx-auto">
        <div
            id="search-engine"
            class="pb-10 sticky top-0 border-4 border-dashed border-secondary bg-white rounded p-2 mb-5 mt-2"
        >
            <h2 class="text-gray-900 text-center font-bold">Search a Sensor</h2>
            <label class="text-lg font-medium text-gray-900" for="input-name">
                Type a value:
                <input
                    name="input-name"
                    id="input-name"
                    type="text"
                    v-model="searchQuery"
                    placeholder="Search a sensor"
                    class="w-full p-2 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                />
            </label>
            <div id="radio-filters" class="bg-white rounded-md mt-2">
                <h3 class="font-bold text-gray-900 text-center">Filters:</h3>
                <ul class="list-none mt-2">
                    <li v-for="filter in filters" :key="filter" class="mb-2 flex items-center gap-2 cursor-pointer">
                        <label
                            class="text-lg font-medium text-gray-900 mt-4 block text-left"
                            :for="'radio-button-' + filter"
                        >
                            {{ filter }}:
                            <input
                                type="radio"
                                :id="'radio-button-' + filter"
                                :value="filter"
                                v-model="selectedFilter"
                                name="search-group"
                                class="cursor-pointer font-medium"
                            />
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
                        @updateSensorName="updateSensorName"
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
import { useUserStore } from '@/stores/userStore';
import { BasicSensor, type Sensor } from '@/models/sensorModel';
import { AxiosError, HttpStatusCode } from 'axios';
import router from '@/router';
const sensors: Ref<Array<Sensor>> = ref([]);
const displayedSensor: Ref<Array<Sensor>> = ref([]);
const searchQuery = ref('');
const filters = ['ip', 'port', 'name'];
const selectedFilter = ref(filters[0]);
const userStore = useUserStore();

onMounted(async () => {
    const token = userStore.token.value;
    try {
        const response = await getAllSensors(token);
        response.data.sensors.forEach((element: Sensor) => {
            sensors.value.push(new BasicSensor(element.ip, String(element.port), element.name || 'unknown'));
            displayedSensor.value.push(new BasicSensor(element.ip, String(element.port), element.name || 'unknown'));
        });
    } catch (error) {
        if (error instanceof AxiosError && error.status === HttpStatusCode.Unauthorized) {
            router.push('/login');
        }
    }
});

const removeSensorFromList = (sensorToRemove: { ip: string; port: string }) => {
    displayedSensor.value = displayedSensor.value.filter(
        (sensor) => sensor.ip !== sensorToRemove.ip || sensor.port !== sensorToRemove.port,
    );
};

const updateSensorName = (sensorInfo: { ip: string; port: string; name: string }) => {
    displayedSensor.value
        .filter((sensor) => sensor.ip === sensorInfo.ip && sensor.port === sensorInfo.port)
        .forEach((sensor) => (sensor.name = sensorInfo.name));
};

const filterSensors = () => {
    const filterKey: string = selectedFilter.value.toLowerCase();
    const query = searchQuery.value;

    if (!query) {
        return sensors.value;
    }

    const filterMap: { [key: string]: (v: Sensor) => boolean } = {
        ip: (sensor: Sensor) => sensor.ip.includes(query),
        port: (sensor: Sensor) => sensor.port.includes(query),
        name: (sensor: Sensor) => sensor.name.includes(query),
    };

    const filterFunction = filterMap[filterKey] || (() => []);
    return sensors.value.filter(filterFunction);
};

watch(searchQuery, () => {
    displayedSensor.value = filterSensors();
});
</script>
