import { useLocalStorage } from '@vueuse/core';
import { fetchAlertNotification, restoreSubscriptions } from '@/apis/notificationsApi';
import { onMounted, ref } from 'vue';

export type SensorInfos = {
    name: string;
    type: string;
    queries: string[];
};

export type Topic = {
    topic: string;
    sensorName?: string;
    query?: string;
};

export type Notification = {
    id: string;
    sensorName: string;
    type: string;
    value: number;
    unit: string;
    timestamp: number;
    query: { value: number; name: string };
};

export type NotificationSubscription = {
    topic: Topic;
    uid: string;
    topicAddr: string;
};

export const getAlertIcon = (alertType: string): string => {
    const icons: { [key: string]: string } = {
        'hydro-level': '💧',
        temperature: '🌡️',
    };
    return icons[alertType] || '⚠️';
};

export const useNotificationState = () => {
    const notifications = useLocalStorage<Notification[]>('notifications', []);
    const isLoading = ref(false);
    const error = ref<string | null>(null);
    const isInitialised = ref(false);

    const prependNotification = (n: Notification) => {
        if (!notifications.value.some((not) => not.id == n.id)) {
            notifications.value.unshift(n);
        }
    };

    const loadNotifications = async () => {
        if (isInitialised.value) return;

        isLoading.value = true;
        error.value = null;

        try {
            notifications.value = await fetchAlertNotification();
            isInitialised.value = true;
        } catch (err) {
            error.value = err instanceof Error ? err.message : 'Failed to load notifications...';
        } finally {
            isLoading.value = false;
        }
    };

    onMounted(async () => {
        // TODO: see where it should be better to initialise notiications (now on first store usage)
        await loadNotifications();
        await restoreSubscriptions();
    });

    return {
        notifications,
        prependNotification,
        loadNotifications,
    };
};
