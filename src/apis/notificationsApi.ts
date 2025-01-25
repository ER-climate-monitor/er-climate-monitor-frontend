import { API_HOST, API_PORT, config } from '@/config/config';
import type { NotificationSubscription, SensorInfos, Topic } from '@/stores/notificationStore';
import { getToken } from '@/utils/manageToken';
import axios, { HttpStatusCode } from 'axios';
import { io } from 'socket.io-client';
import Logger from 'js-logger';

Logger.useDefaults();

async function fetchNotificationTopics(): Promise<SensorInfos[]> {
    try {
        return (await httpRequest<null, SensorInfos[]>('GET', `${config.apiBaseUrl}${config.apiAlertTopics}`)) || [];
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
        Logger.error('An error occurred: ', (error as Error).message);
        return null;
    }
}

function establishSubscription<M>(uid: string, topicAddr: string, messageConsumer: (_: M) => void) {
    const scoket = io(`http://${API_HOST}:${API_PORT}`, { transports: ['websocket'] });

    scoket.on(config.apiWebSocketRooms.CONNECTION, () => {
        Logger.info('Client successfully connected to socket for topic: ', topicAddr);
        scoket.emit(config.apiWebSocketRooms.REGISTRATION, uid, topicAddr);
    });

    scoket.on(config.apiWebSocketRooms.DISCONNECTION, () => {
        Logger.info('Client websocket disconnected to topic: ', topicAddr);
    });

    scoket.on(config.apiWebSocketRooms.REGISTRATION_OUTCOME, (result: { success: boolean; error?: string }) => {
        if (result.success) {
            Logger.info('Client successfully subscribed for topic ', topicAddr);
        } else {
            Logger.error('Registration failed: ', result.error);
        }
    });

    scoket.on(topicAddr, (message: M) => {
        Logger.info(`New incoming message for topic ${topicAddr} => `, JSON.stringify(message));
        messageConsumer(message);
    });
}

async function httpRequest<B, X>(method: 'POST' | 'GET' | 'PUT' | 'DELETE', url: string, body?: B): Promise<X | null> {
    Logger.info(`HttpClient: ${method} on ${url} with body: `, body);
    const options = {
        method: method,
        url: url,
        headers: {
            'Content-Type': 'application/json',
            'x-user-token': retrieveUserToken(),
        },
        data: body,
    };
    return axios
        .request(options)
        .then((res) => {
            Logger.info(`HttpClient: `, res);
            if (res.status == HttpStatusCode.Ok) return res.data as X;
            else throw new Error(`HttpError (status: ${res.status}): ${res.data}`);
        })
        .catch((error) => {
            Logger.error('An error occurred: ', (error as Error).message);
            return null;
        });
}

function retrieveUserToken(): string {
    return getToken();
}

export { fetchNotificationTopics, subscribeToTopic, establishSubscription };
