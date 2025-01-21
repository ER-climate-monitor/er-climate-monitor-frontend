<template>
  <div class="sensor-item">
    <!-- Sensor Information -->
    <div class="sensor-info">
      <label class="sensor-label">IP: {{ ip }}</label>
      <label class="sensor-label">Address: {{ port }}</label>
    </div>

    <!-- Action Buttons -->
    <div class="sensor-actions">
      <button @click="shutOffSensor" class="action-button shut-off">Shut Off</button>
      <button @click="openSettings" class="action-button settings">Settings</button>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  ip: {
    type: String,
    default: '',
  },
  port: {
    type: Number,
    default: 0,
  },
});

const shutOffSensor = () => {
  console.log(props.ip);
};
const openSettings = () => {
  console.log(props.ip);
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
