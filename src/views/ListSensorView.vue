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
import { ref } from 'vue';
const sensors = ref([]);
</script>
