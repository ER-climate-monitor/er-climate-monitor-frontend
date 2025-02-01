<template>
    <div class="w-full max-w-md mb-4">
        <span id="sensor-list-label" class="block text-sm font-medium text-gray-700 mb-2"> Select Sensor Type </span>

        <ul class="w-full border rounded-lg shadow-sm bg-white" role="listbox" aria-labelledby="sensor-list-label">
            <li
                v-for="type in sensorTypes"
                :key="type"
                @click="selectSensor(type)"
                @keydown.enter="selectSensor(type)"
                class="px-4 py-2 cursor-pointer hover:bg-pastelViolet-50 transition-colors duration-200"
                :class="{ 'bg-pastelViolet-100': selectedSensor === type }"
                role="option"
                tabindex="0"
                :aria-selected="selectedSensor === type"
            >
                {{ type }}
            </li>
            <li v-if="sensorTypes.length === 0" class="px-4 py-2 text-gray-500">No sensor types available</li>
        </ul>
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

const selectSensor = (type: string) => {
    selectedSensor.value = type;
    emit('update:modelValue', type);
};
</script>

<style scoped>
ul {
    list-style: none;
    padding: 0;
    margin: 0;
}

li {
    border-bottom: 1px solid #e5e7eb;
}

li:last-child {
    border-bottom: none;
}
</style>
