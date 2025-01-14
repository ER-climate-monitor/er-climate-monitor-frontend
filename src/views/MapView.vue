<template>
  <div class="flex flex-col items-center justify-center min-h-screen p-4">
    <div class="w-full max-w-md mb-4">
      <label for="sensor-type" class="block text-sm font-medium text-gray-700 mb-2">
        Select Sensor Type
      </label>
      <select
        id="sensor-type"
        v-model="selectedSensorType"
        @change="updateMap"
        class="w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
      >
        <option value="">-- Select a sensor type --</option>
        <option v-for="type in sensorTypes" :key="type" :value="type">
          {{ type }}
        </option>
      </select>
    </div>

    <MapComponent :sensorType="selectedSensorType" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import MapComponent from '@/components/Map/MapComponent.vue'

const sensorTypes = ref(['Temperature', 'Humidity', 'Air Quality'])
const selectedSensorType = ref<string>('')

const updateMap = () => {
  console.log('Selected sensor type:', selectedSensorType.value)
}
</script>
