<template>
  <div class="sensor-list">
    <ul>
      <li v-for="sensor in sensors" :key="sensor.ip">
        <SensorItem :ip="sensor.ip" :address="sensor.port" />
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import SensorItem from '@/components/List/ListComponent.vue';
import { getAllSensors } from '@/apis/sensorRegistryApi';
import { ref, onMounted, type Ref } from 'vue';
import { getToken } from '@/utils/manageToken';
import { Sensor, type ISensor } from '@/models/sensorModel';
const sensors: Ref<Array<Sensor>> = ref([]);
onMounted(async () => {
  const token = getToken();
  const response = await getAllSensors(token);
  response.data.sensors.forEach((element: ISensor) => {
    sensors.value.push(new Sensor(element.ip, element.port));
  });
});
</script>
