import { API_HOST, API_PORT, config } from '@/config/config';
import {
    useNotificationState,
    type Notification,
    type NotificationSubscription,
    type SensorInfos,
    type Topic,
} from '@/stores/notificationStore';
import { useUserStore } from '@/stores/userStore';
import axios, { HttpStatusCode } from 'axios';
import { io, Socket } from 'socket.io-client';
import Logger from 'js-logger';
import { fromTopicToTopicAddress } from '@/utils/notificationUtils';

Logger.useDefaults();
Logger.setLevel(Logger.ERROR);

const { prependNotification, showNotificationPopup, getUnkonwnsId } = useNotificationState();
const userStore = useUserStore();

async function fetchAlertNotification(): Promise<Notification[]> {
    try {
        return (
            (await httpRequest<null, Notification[]>(
                'GET',
                `${config.apiBaseUrl}${config.subscriptionsApi.getUserAlerts}`,
            )) || []
        );
    } catch (error) {
        Logger.error((error as Error).message);
        return [];
    }
}

async function fetchUserSubscritpions(): Promise<Topic[]> {
    try {
        return (
            (await httpRequest<null, Topic[]>(
                'GET',
                `${config.apiBaseUrl}${config.subscriptionsApi.getSubscriptions}`,
            )) || []
        );
    } catch (error) {
        Logger.error(error);
        return [];
    }
}

async function fetchNotificationTopics(): Promise<SensorInfos[]> {
    try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const res = await httpRequest<null, any>('GET', `${config.apiBaseUrl}${config.apiAlertTopics}`);
        if (res.sensors) {
          return res.sensors as SensorInfos[];
        } else {
          return res;
        }
    } catch (error) {
        Logger.error((error as Error).message);
        return [];
    }
}

async function subscribeToTopic(topic: Topic): Promise<NotificationSubscription | null> {
    try {
        const res = await httpRequest<Topic, { uid: string; topicAddr: string }>(
            'POST',
            `${config.apiBaseUrl}${config.subscriptionsApi.subscribeToTopic}`,
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

async function unsubscribeToTopic(topic: Topic): Promise<boolean> {
    const topicAddr = fromTopicToTopicAddress(topic);
    try {
        await httpRequest<null, null>(
            'DELETE',
            `${config.apiBaseUrl}${config.subscriptionsApi.unsubscribeToTopic}?topicAddr=${topicAddr}`,
        );
        return true;
    } catch (error) {
        Logger.error('An error occurred: ', (error as Error).message);
        return false;
    }
}

async function restoreSubscriptions() {
    try {
        const res = await httpRequest<null, { uid: string; topicAddr: string }[]>(
            'GET',
            `${config.apiBaseUrl}${config.subscriptionsApi.restoreSubscriptions}`,
        );

        res?.forEach((subInfo) => {
            establishSubscription(subInfo.uid, subInfo.topicAddr, (n: Notification) => {
                if (!n.id) n.id = getUnkonwnsId.value;
                prependNotification(n);
                showNotificationPopup(n);
            });
        });
    } catch (error) {
        Logger.error('An error occurred: ', (error as Error).message);
    }
}

function establishSubscription<M>(uid: string, topicAddr: string, messageConsumer: (_: M) => void): Socket {
    const scoket = io(config.subscriptionsApi.apiWebSocketRooms.WEB_SOCKET_URL, { transports: ['websocket'] });
    scoket.connect()
    scoket.on(config.subscriptionsApi.apiWebSocketRooms.CONNECTION, () => {
        Logger.info('Client successfully connected to socket for topic: ', topicAddr);
        scoket.emit(config.subscriptionsApi.apiWebSocketRooms.REGISTRATION, uid, topicAddr);
    });

    scoket.on(config.subscriptionsApi.apiWebSocketRooms.DISCONNECTION, () => {
        Logger.info('Client websocket disconnected to topic: ', topicAddr);
    });

    scoket.on(
        config.subscriptionsApi.apiWebSocketRooms.REGISTRATION_OUTCOME,
        (result: { success: boolean; error?: string }) => {
            if (result.success) {
                Logger.info('Client successfully subscribed for topic ', topicAddr);
            } else {
                Logger.error('Registration failed: ', result.error);
            }
        },
    );

    scoket.on(topicAddr, (message: M) => {
        Logger.info(`New incoming message for topic ${topicAddr} => `, JSON.stringify(message));
        messageConsumer(message);
    });

    return scoket
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
    return userStore.token.value;
}

export {
    fetchAlertNotification,
    fetchNotificationTopics,
    fetchUserSubscritpions,
    subscribeToTopic,
    unsubscribeToTopic,
    establishSubscription,
    restoreSubscriptions,
};

