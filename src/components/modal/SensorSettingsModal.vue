<template>
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
        <div class="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <!-- Modal Title -->
            <h3 class="text-xl font-semibold text-gray-900 mb-4">Sensor Settings</h3>

            <!-- Close Button -->
            <button class="absolute top-4 right-4 text-gray-500 hover:text-red-900" @click="$emit('close')">X</button>

            <!-- Name Section -->
            <div class="mb-6">
                <h4 class="text-lg font-medium text-gray-900 mb-2">Change Sensor Name</h4>
                <input
                    v-model="localName"
                    type="text"
                    class="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                />
                <button
                    @click="changeName"
                    class="mt-2 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    Change Name
                </button>
            </div>

            <!-- Days Section -->
            <div class="mb-6">
                <h4 class="text-lg font-medium text-gray-900 mb-2">Cronjob days [format: dd-dd]</h4>
                <input
                    v-model="newDay"
                    type="text"
                    placeholder="Add a day"
                    class="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                />
                <button
                    @click="addDay"
                    class="mt-2 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    Add Day
                </button>
            </div>

            <!-- Working Hours Section -->
            <div class="mb-6">
                <h4 class="text-lg font-medium text-gray-900 mb-2">Cronjob Time</h4>
                <div class="flex space-x-4">
                    <input
                        v-model.number="localWorkingHours.hours"
                        type="number"
                        class="w-1/2 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                        max="23"
                        min="0"
                        placeholder="Hours"
                    />
                    <input
                        v-model.number="localWorkingHours.minutes"
                        type="number"
                        max="59"
                        min="0"
                        class="w-1/2 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                        placeholder="Minutes"
                    />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { checkSensorDays } from '@/apis/sensorRegistryApi';
import { UPDATE_CRONJOB_DAYS, UPDATE_NAME_ACTION } from '@/headers/sensorHeaders';
import { ref, reactive } from 'vue';
import '@/assets/tailwind.css';

const props = defineProps({
    name: { type: String, required: true },
    days: { type: Array, default: () => [] },
    workingHours: { type: Object, default: () => ({ hours: 0, minutes: 0 }) },
});

const emit = defineEmits(['close', 'save']);

const localName = ref(props.name);
const localWorkingHours = reactive({ ...props.workingHours });
const newDay = ref('');
const message = {
    action: '',
    name: '',
    days: '',
    hour: '',
    minute: '',
};

const updateAction = (action: string) => {
    message.action = action;
};

const prepareUpdateName = (newName: string) => {
    updateAction(UPDATE_NAME_ACTION);
    message.name = newName;
};

const prepareUpdateDays = (days: string) => {
    updateAction(UPDATE_CRONJOB_DAYS);
    message.days = days;
};

const close = () => {
    emit('close');
};

const addDay = () => {
    if (newDay.value.trim() && checkSensorDays(newDay.value)) {
        prepareUpdateDays(newDay.value);
        emit('save', message);
        close();
    } else {
        alert('The input dayus should be formated like so: [0-6] and the values must be included in the range [0, 6]');
    }
};

const changeName = async () => {
    if (localName.value.trim()) {
        prepareUpdateName(localName.value);
        emit('save', message);
        close();
    }
};
</script>
