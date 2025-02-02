<template>
    <div class="space-y-4">
        <h3
            @click="isExpanded = !isExpanded"
            @keydown.enter="isExpanded = !isExpanded"
            @keydown.space="isExpanded = !isExpanded"
            role="button"
            tabindex="0"
            class="text-lg font-medium text-gray-900 cursor-pointer hover:text-gray-600 transition-colors flex items-center gap-2"
        >
            Subscribe to new Topic
            <span class="font-material-symbols text-sm transition-transform" :class="{ 'rotate-180': isExpanded }">
                expand_more
            </span>
        </h3>

        <Transition
            enter-active-class="transition duration-200 ease-out"
            enter-from-class="transform scale-y-0 opacity-0"
            enter-to-class="transform scale-y-100 opacity-100"
            leave-active-class="transition duration-200 ease-in"
            leave-from-class="transform scale-y-100 opacity-100"
            leave-to-class="transform scale-y-0 opacity-0"
            :origin="'top'"
        >
            <div v-show="isExpanded">
                <div class="flex gap-4">
                    <div class="flex-1">
                        <label for="alert-topic" class="block text-sm font-medium text-gray-700"
                            >Select Topic
                            <select
                                id="alert-topic"
                                v-model="selectedType"
                                class="w-full border p-2 rounded text-gray-900"
                                :disabled="isLoadingTopics"
                            >
                                <option value="">Select Topic</option>
                                <option v-for="typeName in typeNames" :key="typeName" :value="typeName">
                                    {{ typeName }}
                                </option>
                            </select>
                        </label>
                        <div v-if="isLoadingTopics" class="text-sm text-gray-500 mt-1">Loading topics...</div>
                        <div v-if="topicsError" class="text-sm text-red-500 mt-1">
                            {{ topicsError }}
                        </div>
                    </div>

                    <div class="flex-1">
                        <label for="sensor-name" class="block text-sm font-medium text-gray-700"
                            >Select Sensor
                            <select
                                id="sensor-name"
                                v-model="selectedSensor"
                                class="w-full border p-2 rounded text-gray-900"
                                :disabled="!selectedType || sensorNames.length === 0"
                            >
                                <option value="">Select Sensor Name</option>
                                <option v-for="sensorName in sensorNames" :key="sensorName" :value="sensorName">
                                    {{ sensorName }}
                                </option>
                            </select>
                        </label>
                    </div>

                    <div class="flex-1">
                        <label for="query" class="block text-sm font-medium text-gray-700"
                            >Select Query
                            <select
                                id="query"
                                v-model="selectedQuery"
                                class="w-full border p-2 rounded text-gray-900"
                                :disabled="!selectedType || queries.length === 0"
                            >
                                <option value="">Select Query</option>
                                <option v-for="query in queries" :key="query" :value="query">
                                    {{ query }}
                                </option>
                            </select>
                        </label>
                    </div>
                </div>

                <button
                    @click="subscribe"
                    :disabled="!canSubscribe"
                    class="w-full bg-pastelViolet text-white px-4 py-2 rounded disabled:bg-pastelViolet-300 disabled:cursor-not-allowed mt-4"
                >
                    {{ subscribeButtonText }}
                </button>
            </div>
        </Transition>
    </div>
</template>

<script setup lang="ts">
import { fetchNotificationTopics } from '@/apis/notificationsApi';
import { type SensorInfos, type Topic } from '@/stores/notificationStore';
import Logger from 'js-logger';
import { computed, onMounted, ref, watch } from 'vue';

Logger.useDefaults();
Logger.setLevel(Logger.ERROR);

const isExpanded = ref(true); // Start expanded by default
const typeNames = ref<Set<string>>(new Set());
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

const emit = defineEmits<{
    'subscription-changed': [topic: Topic];
}>();

const canSubscribe = computed(() => selectedType.value && !isLoadingTopics.value);

const subscribe = () => {
    if (!canSubscribe.value) return;
    const topic: Topic = {
        topic: selectedType.value!,
        sensorName: selectedSensor.value,
        query: selectedQuery.value,
    };
    emit('subscription-changed', topic);
    selectedType.value = undefined;
    selectedSensor.value = undefined;
    selectedQuery.value = undefined;
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

    if (response.length == 0) {
        topicsError.value = 'No topics found...';
    } else {
        topics.value = response;
        typeNames.value = new Set(topics.value.map((t) => t.type));
    }
    isLoadingTopics.value = false;
};

watch(selectedType, () => {
    selectedSensor.value = undefined;
    selectedQuery.value = undefined;
});

onMounted(fetchTopics);
</script>
