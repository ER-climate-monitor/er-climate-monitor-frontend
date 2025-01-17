<template>
  <div class="flex flex-col items-center justify-center min-h-screen p-4">
    <SensorTypeSelect :sensorTypes="sensorTypes" v-model="selectedSensorType" />
    <MapComponent :sensorType="selectedSensorType" :locations="sensorLocations" />
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import SensorTypeSelect from '@/components/Map/SensorTypeSelect.vue';
import MapComponent from '@/components/Map/MapComponent.vue';
import { fetchSensorLocations } from '@/services/api';

const sensorTypes = ref(['Temperature', 'Hydro', 'Air Quality']);
const selectedSensorType = ref<string>('');
const sensorLocations = ref<{ latitude: number; longitude: number }[]>([]);

const updateSensorLocations = async () => {
  sensorLocations.value = await fetchSensorLocations(selectedSensorType.value);
  console.log('Updated sensor locations:', sensorLocations.value);
};

watch(selectedSensorType, updateSensorLocations);
</script>
