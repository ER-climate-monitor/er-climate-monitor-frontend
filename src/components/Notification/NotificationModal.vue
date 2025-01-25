<template>
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center" @click="$emit('close')">
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
import { type Notification, type Topic, useNotificationState } from '@/stores/notificationStore';
import { establishSubscription, subscribeToTopic } from '@/apis/notificationsApi';
import Logger from 'js-logger';

Logger.useDefaults();

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
    } catch (err) {
        Logger.error(`Something went wrong during subscription for ${JSON.stringify(ev)}: `, err);
    }
};

const openExpandedAlert = (alert: Notification) => {
    selectedAlert.value = alert;
};
</script>
