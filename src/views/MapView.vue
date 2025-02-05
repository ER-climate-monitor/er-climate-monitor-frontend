<template>
    <div class="flex flex-row items-center justify-center p-4">
        <div class="flex flex-col p-4">
            <SensorTypeSelect :sensorTypes="sensorTypes" v-model="selectedSensorType" class="w-80" />
            <div class="h-8">
                <div v-if="isLoading">Loading locations...</div>
                <div v-else-if="sensorLocations.length === 0">
                    <p>No locations found.</p>
                </div>
            </div>
        </div>
        <MapComponent :sensorType="selectedSensorType" :locations="sensorLocations" class="z-10" />
    </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import SensorTypeSelect from '@/components/Map/SensorTypeSelect.vue';
import MapComponent from '@/components/Map/MapComponent.vue';
import type { SensorLocation } from '@/types/SensorLocation';
import { fetchSensorLocations } from '@/apis/detectionApi';
import { useUserStore } from '@/stores/userStore';
import { sensorDisplayNames } from '@/costant/sensorDisplayNames';

const isLoading = ref(false);
const sensorTypes = ref(Object.keys(sensorDisplayNames));
const selectedSensorType = ref<string>('');
const sensorLocations = ref<SensorLocation[]>([]);
const userStore = useUserStore();

const updateSensorLocations = async () => {
    isLoading.value = true;
    const token = userStore.token.value;
    try {
        const locations = await fetchSensorLocations(selectedSensorType.value, token);
        sensorLocations.value = locations;
    } catch (error) {
        console.error('Error fetching sensor locations:', error);
        sensorLocations.value = [];
    } finally {
        isLoading.value = false;
    }
};

watch(selectedSensorType, updateSensorLocations);
</script>
