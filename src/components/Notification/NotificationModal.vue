<template>
  <div
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
    @click="$emit('close')"
  >
    <div class="bg-white rounded-lg p-6 w-full max-w-2xl" @click.stop>
      <div class="flex justify-between mb-4">
        <h2 class="text-xl font-bold text-gray-900">Notifications</h2>
        <button @click="$emit('close')" class="text-gray-500">&times;</button>
      </div>

      <AlertSelector @subscription-changed="handleSubscriptionChange" />

      <AlertList :notifications="notifications" @view-details="openExpandedAlert" />

      <ExpandedAlert v-if="selectedAlert" :alert="selectedAlert" @close="selectedAlert = null" />
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import AlertSelector from '@/components/Notification/AlertSelector.vue';
import AlertList from '@/components/Notification/AlertList.vue';
import ExpandedAlert from '@/components/Notification/ExpandedAlert.vue';
import { type Notification, type Topic, type TopicQuery } from '@/stores/notificationStore';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const props = defineProps({
  notifications: {
    type: Array<Notification>,
    required: true,
  },
});

const selectedAlert = ref<Notification | null>(null);
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const handleSubscriptionChange = (args: { topic: Topic; query: TopicQuery }) => {
  // LOGIC to subcribe to topic and register web socket
  // const response = await axios.post('/api/subscribe', { topic, threshold })
  // const { uid, topicAddr } = response.data
  // addSubscription({
  //   topic,
  //   threshold,
  //   uid,
  //   topicAddr
  // })
  // registerWebSocketConnection(uid, topicAddr)
};

const openExpandedAlert = (alert: Notification) => {
  selectedAlert.value = alert;
};
</script>
