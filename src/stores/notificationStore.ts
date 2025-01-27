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

/**
 * TODO: remember to generate id in notification service
 */
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
