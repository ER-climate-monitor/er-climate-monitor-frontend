import { config } from '@/config/config';
import type { NotificationSubscription, SensorInfos, Topic } from '@/stores/notificationStore';
import axios, { HttpStatusCode } from 'axios';
import Logger from 'js-logger';

Logger.useDefaults();

//TODO: attach

async function fetchNotificationTopics(): Promise<SensorInfos[]> {
    try {
        return (
            (await httpRequest<null, SensorInfos[]>('GET', `${config.apiAlertTopics}${config.apiAlertTopics}`)) || []
        );
    } catch (error) {
        Logger.error((error as Error).message);
        return [];
    }
}

async function subscribeToTopic(topic: Topic): Promise<NotificationSubscription | null> {
    try {
        const res = await httpRequest<Topic, { uid: string; topicAddr: string }>(
            'POST',
            `${config.apiBaseUrl}${config.apiSubscribeToTopic}`,
            topic,
        );
        if (!res) {
            return null;
        }
        return { topic, uid: res.uid, topicAddr: res.topicAddr };
    } catch (error) {
        Logger.error((error as Error).message);
        return null;
    }
}

function httpRequest<B, X>(method: 'POST' | 'GET' | 'PUT' | 'DELETE', url: string, body?: B): Promise<X | null> {
    const options = {
        method: method,
        url: url,
        headers: {
            'Content-Type': 'application/json',
            userToken: retrieveUserToken(),
        },
        data: body,
    };
    return axios
        .request(options)
        .then((res) => {
            if (res.status == HttpStatusCode.Ok) return res.data as X;
            else throw new Error(`HttpError (status: ${res.status}): ${res.data}`);
        })
        .catch((err: Error) => {
            Logger.error(err);
            return null;
        });
}

function retrieveUserToken(): string {
    return '';
}

export { fetchNotificationTopics, subscribeToTopic };
