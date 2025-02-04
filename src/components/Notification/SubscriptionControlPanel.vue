<template>
    <div class="space-y-4">
        <button
            @click="isExpanded = !isExpanded"
            @keydown.enter="isExpanded = !isExpanded"
            @keydown.space="isExpanded = !isExpanded"
            hover:text-gray-600
            transition-colors
            flex
            items-center
            gap-2
            class="text-lg font-medium text-gray-900 cursor-pointer hover:text-gray-600 transition-colors flex items-center gap-2"
        >
            Active Subscriptions
            <span class="font-material-symbols text-sm transition-transform" :class="{ 'rotate-180': isExpanded }">
                expand_more
            </span>
        </button>

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
                <div v-if="subscriptions.size === 0" class="text-gray-900">No active subscriptions</div>
                <div v-else class="max-h-[320px] overflow-y-auto pr-2">
                    <div class="space-y-2">
                        <div
                            v-for="sub in subscriptions"
                            :key="sub.topic"
                            class="flex items-center justify-between p-4 bg-white rounded-lg border text-gray-900"
                        >
                            <div class="space-y-1">
                                <div class="font-medium">{{ sub.topic }}</div>
                                <div v-if="sub.sensorName" class="text-sm text-gray-900">
                                    Sensor: {{ sub.sensorName }}
                                </div>
                                <div v-if="sub.query" class="text-sm text-gray-900">Query: {{ sub.query }}</div>
                            </div>
                            <button
                                @click="() => handleUnsubscribe(sub)"
                                class="p-2 text-gray-900 hover:text-red-500 transition-colors"
                                :disabled="isUnsubscribing"
                            >
                                <span class="material-symbols-outlined">delete</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </Transition>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { type Topic } from '@/stores/notificationStore';
import Logger from 'js-logger';

Logger.useDefaults();
Logger.setLevel(Logger.ERROR);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const props = defineProps<{ subscriptions: Set<Topic> }>();
const emit = defineEmits<{ 'subscription-removed': [topic: Topic] }>();

const isUnsubscribing = ref(false);
const isExpanded = ref(true); // Start expanded by default

const handleUnsubscribe = async (topic: Topic) => {
    try {
        isUnsubscribing.value = true;
        emit('subscription-removed', topic);
    } catch (error) {
        Logger.error(error);
    } finally {
        isUnsubscribing.value = false;
    }
};
</script>
