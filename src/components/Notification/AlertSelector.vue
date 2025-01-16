<template>
  <div class="space-y-4">
    <div class="flex gap-4">
      <!-- Alert Topic Dropdown -->
      <div class="flex-1">
        <select
          v-model="selectedTopic"
          class="w-full border p-2 rounded text-gray-900"
          :disabled="isLoadingTopics"
        >
          <option value="">Select Topic</option>
          <option v-for="topic in topics" :key="topic.id" :value="topic">
            {{ topic.name }}
          </option>
        </select>
        <div v-if="isLoadingTopics" class="text-sm text-gray-500 mt-1">Loading topics...</div>
        <div v-if="topicsError" class="text-sm text-red-500 mt-1">
          {{ topicsError }}
        </div>
      </div>

      <!-- Queries Dropdown -->
      <div class="flex-1">
        <select
          v-model="selectedQuery"
          class="w-full border p-2 rounded text-gray-900"
          :disabled="!selectedTopic || isLoadingQueries"
        >
          <option value="">Select Threshold</option>
          <option v-for="query in queries" :key="query.id" :value="query">
            {{ query.name }}
          </option>
        </select>
        <div v-if="isLoadingQueries" class="text-sm text-gray-500 mt-1">Loading thresholds...</div>
        <div v-if="queryError" class="text-sm text-red-500 mt-1">
          {{ queryError }}
        </div>
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
import { fetchNotificationTopics, fetchQueriesForTopic } from '@/apis/notificationsApi';
import { type Topic, type TopicQuery } from '@/stores/notificationStore';
import { computed, ref, watch } from 'vue';

const topics = ref<Topic[]>([]);
const queries = ref<TopicQuery[]>([]);
const selectedTopic = ref<Topic | undefined>();
const selectedQuery = ref<TopicQuery | undefined>();
const isLoadingTopics = ref(false);
const isLoadingQueries = ref(false);
const topicsError = ref('');
const queryError = ref('');

const emit = defineEmits<{
  'subscription-changed': [{ topic: Topic; query: TopicQuery }];
}>();

// const { addSubscription } = useNotifications();

const canSubscribe = computed(
  () =>
    selectedTopic.value && selectedQuery.value && !isLoadingTopics.value && !isLoadingQueries.value,
);

const subscribeButtonText = computed(() => {
  if (isLoadingTopics.value || isLoadingQueries.value) return 'Loading...';
  if (!selectedTopic.value) return 'Select an Alert Topic';
  if (!selectedQuery.value) return 'Select a query for selected alert';
  return 'Subscribe to get notifications';
});

const fetchTopics = async () => {
  isLoadingTopics.value = true;
  topicsError.value = '';
  const response = await fetchNotificationTopics();

  if (!response) {
    topicsError.value = 'Failed to load topics. Please try again.';
  } else {
    topics.value = response;
  }
  isLoadingTopics.value = false;
};

const fetchQueries = async (topic: Topic) => {
  if (!topic) {
    queries.value = [];
    return;
  }
  isLoadingQueries.value = true;
  queryError.value = '';
  const response = await fetchQueriesForTopic(topic.id);
  if (!response) {
    queryError.value = `Failed to queries for topic: ${topic.name}. Please try again.`;
  } else {
    queries.value = response;
  }
  isLoadingQueries.value = false;
};

watch(selectedTopic, (newTopic: Topic | undefined) => {
  selectedQuery.value = undefined;
  if (newTopic) {
    fetchQueries(newTopic);
  }
});

const subscribe = () => {
  if (!canSubscribe.value) return;
  const selectedTopicData = topics.value.find((t) => t.id === selectedTopic.value?.id);
  const selectedQueryData = queries.value.find((q) => q.id === selectedQuery.value?.id);

  if (selectedTopicData && selectedQueryData) {
    emit('subscription-changed', {
      topic: selectedTopicData,
      query: selectedQueryData,
    });
  }
};

fetchTopics();
</script>
