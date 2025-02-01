<template>
    <div
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
        role="button"
        tabindex="0"
        @click="$emit('close')"
        @keydown.enter="$emit('close')"
        @keydown.space="$emit('close')"
    >
        <div class="bg-white rounded-lg p-6 w-full max-w-2xl" @click.stop>
            <div class="flex justify-between mb-4">
                <h2 class="text-xl font-bold text-gray-900">Notifications</h2>
                <button @click="$emit('close')" class="text-gray-500">&times;</button>
            </div>

            <SubscriptionControlPanel :subscriptions="userSubscriptions" @subscription-removed="handleUnsubscribe" />

            <AlertSelector @subscription-changed="handleSubscriptionChange" />

            <AlertList :notifications="notifications" @view-details="openExpandedAlert" />

            <ExpandedAlert v-if="selectedAlert" :alert="selectedAlert" @close="selectedAlert = null" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import SubscriptionControlPanel from '@/components/Notification/SubscriptionControlPanel.vue';
import AlertSelector from '@/components/Notification/AlertSelector.vue';
import AlertList from '@/components/Notification/AlertList.vue';
import ExpandedAlert from '@/components/Notification/ExpandedAlert.vue';
import { type Notification, type Topic, useNotificationState } from '@/stores/notificationStore';
import {
    establishSubscription,
    fetchUserSubscritpions,
    subscribeToTopic,
    unsubscribeToTopic,
} from '@/apis/notificationsApi';
import Logger from 'js-logger';

Logger.useDefaults();
Logger.setLevel(Logger.ERROR);

const userSubscriptions = ref<Set<Topic>>(new Set());
const selectedAlert = ref<Notification | null>(null);

const { notifications, prependNotification } = useNotificationState();

const handleSubscriptionChange = async (ev: Topic) => {
    try {
        const sub = await subscribeToTopic(ev);
        if (!sub) {
            Logger.error('Failed to subscribe for: ', ev);
            return;
        }
        Logger.info('Subscribing for: ', sub);
        establishSubscription<Notification>(sub.uid, sub.topicAddr, prependNotification);
        userSubscriptions.value.add(ev);
    } catch (err) {
        Logger.error(`Something went wrong during subscription for ${JSON.stringify(ev)}: `, err);
    }
};

const handleUnsubscribe = async (topic: Topic) => {
    if (await unsubscribeToTopic(topic)) {
        userSubscriptions.value.delete(topic);
    }
};

const openExpandedAlert = (alert: Notification) => {
    selectedAlert.value = alert;
};

onMounted(async () => {
    const subs = await fetchUserSubscritpions();
    userSubscriptions.value = new Set(subs);
});
</script>
