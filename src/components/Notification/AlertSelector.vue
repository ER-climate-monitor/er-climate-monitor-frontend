<template>
    <div class="space-y-4">
        <div class="flex gap-4">
            <!-- Alert Topic Dropdown -->
            <div class="flex-1">
                <select
                    v-model="selectedType"
                    class="w-full border p-2 rounded text-gray-900"
                    :disabled="isLoadingTopics"
                >
                    <option value="">Select Topic</option>
                    <option v-for="typeName in typeNames" :key="typeName" :value="typeName">
                        {{ typeName }}
                    </option>
                </select>
                <div v-if="isLoadingTopics" class="text-sm text-gray-500 mt-1">Loading topics...</div>
                <div v-if="topicsError" class="text-sm text-red-500 mt-1">
                    {{ topicsError }}
                </div>
            </div>

            <!-- Sensor Names Dropdown -->
            <div class="flex-1">
                <select
                    v-model="selectedSensor"
                    class="w-full border p-2 rounded text-gray-900"
                    :disabled="!selectedType || sensorNames.length === 0"
                >
                    <option value="">Select Sensor Name</option>
                    <option v-for="sensorName in sensorNames" :key="sensorName" :value="sensorName">
                        {{ sensorName }}
                    </option>
                </select>
            </div>

            <!-- Queries Dropdown -->
            <div class="flex-1">
                <select
                    v-model="selectedQuery"
                    class="w-full border p-2 rounded text-gray-900"
                    :disabled="!selectedType || queries.length === 0"
                >
                    <option value="">Select Query</option>
                    <option v-for="query in queries" :key="query" :value="query">
                        {{ query }}
                    </option>
                </select>
            </div>
        </div>

        <button
            @click="subscribe"
            :disabled="!canSubscribe"
            class="w-full bg-blue-500 text-white px-4 py-2 rounded disabled:bg-blue-300 disabled:cursor-not-allowed"
        >
            {{ subscribeButtonText }}
        </button>
    </div>
</template>

<script setup lang="ts">
import { fetchNotificationTopics } from '@/apis/notificationsApi';
import { type SensorInfos, type Topic } from '@/stores/notificationStore';
import { computed, ref, watch } from 'vue';

const typeNames = ref<string[]>([]);

const selectedType = ref<string | undefined>();
const selectedSensor = ref<string | undefined>();
const selectedQuery = ref<string | undefined>();

const isLoadingTopics = ref(false);
const topicsError = ref('');

const topics = ref<SensorInfos[]>([]);

const sensorNames = computed(() => {
    if (selectedType.value) {
        return topics.value.filter((t) => t.type == selectedType.value).map((t) => t.name);
    } else {
        return [];
    }
});

const queries = computed(() => {
    if (selectedType.value) {
        return topics.value.filter((t) => t.type == selectedType.value)[0].queries;
    } else {
        return [];
    }
});

const canSubscribe = computed(() => selectedType.value && !isLoadingTopics.value);

const subscribe = () => {
    if (!canSubscribe.value) return;
    const topic: Topic = {
        topic: selectedType.value!,
        sensorName: selectedSensor.value,
        query: selectedQuery.value,
    };
    emit('subscription-changed', { topic });
};

const subscribeButtonText = computed(() => {
    if (isLoadingTopics.value) return 'Loading...';
    if (!selectedType.value) return 'Select at least an Alert Topic';
    return 'Subscribe to get notifications';
});

const fetchTopics = async () => {
    isLoadingTopics.value = true;
    topicsError.value = '';
    const response = await fetchNotificationTopics();

    console.log(response);
    if (response.length == 0) {
        topicsError.value = 'No topics found...';
    } else {
        topics.value = response;
        typeNames.value = topics.value.map((t) => t.type);
    }
    isLoadingTopics.value = false;
};

watch(selectedType, () => {
    selectedSensor.value = undefined;
    selectedQuery.value = undefined;
});

const emit = defineEmits<{
    'subscription-changed': [{ topic: Topic }];
}>();

fetchTopics();
</script>
