const API_HOST = import.meta.env.API_HOST || 'localhost';
const API_PORT = import.meta.env.API_POST || '3000';
const API_VERSION = import.meta.env.API_VERSION || 'v0';

const config = {
    apiBaseUrl: `http://${API_HOST}:${API_PORT}/${API_VERSION}/api`,
    apiAlertTopics: '/sensor/all',
    subscriptionsApi: {
        subscribeToTopic: '/alert/subscriptions',
        unsubscribeToTopic: '/alert/subscriptions',
        getSubscriptions: '/alert/subscriptions',
        restoreSubscriptions: '/alert/subscriptions/restore',
        getUserAlerts: '/alert',
        apiWebSocketRooms: {
            WEB_SOCKET_URL: 'http://notifications-service:4444',
            CONNECTION: 'connect',
            DISCONNECTION: 'disconnect',
            REGISTRATION: 'register',
            REGISTRATION_OUTCOME: 'registered',
        },
    },
};

export { API_HOST, API_PORT, API_VERSION, config };
