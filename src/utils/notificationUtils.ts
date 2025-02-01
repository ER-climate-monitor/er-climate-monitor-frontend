import type { Topic } from '@/stores/notificationStore';

export function parseTopicAddress(sub: string, prefix: string | null = 'notification'): Topic {
    if (prefix && sub.startsWith(`${prefix}.`)) {
        sub = sub.substring(prefix.length + 1);
    }

    const parts = sub.split('.');
    const subscription: Topic = { topic: parts[0] };

    if (parts.length === 2 && parts[1] == '#') {
        return subscription;
    } else if (parts.length === 3 && parts[1] === '*') {
        subscription.query = parts[2];
    } else if (parts.length === 3 && parts[2] === '#') {
        subscription.sensorName = parts[1];
    } else if (parts.length === 3) {
        subscription.sensorName = parts[1];
        subscription.query = parts[2];
    }
    return subscription;
}

export function fromTopicToTopicAddress(sub: Topic): string {
    const topicName = `${sub.topic}`;

    if (!sub.sensorName) {
        if (!sub.query) {
            return `${topicName}.#`;
        }
        return `${topicName}.*.${sub.query}`;
    }

    if (!sub.query) {
        return `${topicName}.${sub.sensorName}.#`;
    }
    return `${topicName}.${sub.sensorName}.${sub.query}`;
}
