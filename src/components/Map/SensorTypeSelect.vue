<template>
    <div class="w-full max-w-md mb-4">
        <label for="sensor-type" class="block text-sm font-medium text-gray-700 mb-2"> Select Sensor Type </label>
        <select
            id="sensor-type"
            v-model="selectedSensor"
            @change="onSensorTypeChange"
            class="w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
        >
            <option value="">-- Select a sensor type --</option>
            <option v-for="type in sensorTypes" :key="type" :value="type">
                {{ type }}
            </option>
        </select>
    </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, watch, ref } from 'vue';

const props = defineProps({
    sensorTypes: {
        type: Array as () => string[],
        required: true,
    },
    modelValue: {
        type: String,
        required: true,
    },
});

const emit = defineEmits(['update:modelValue']);

const selectedSensor = ref(props.modelValue);

watch(
    () => props.modelValue,
    (newValue) => {
        selectedSensor.value = newValue;
    },
);

const onSensorTypeChange = () => {
    emit('update:modelValue', selectedSensor.value);
};
</script>
