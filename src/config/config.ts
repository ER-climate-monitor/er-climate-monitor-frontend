const API_HOST = "https://api-gateway-17633123551.europe-west8.run.app";
const API_PORT = "8080";
const API_VERSION = 'v0';

const config = {
    apiBaseUrl: `${API_HOST}/${API_VERSION}/api`,
    socketBaseUrl: API_HOST,
    apiAlertTopics: '/sensor/all',
    subscriptionsApi: {
        subscribeToTopic: '/alert/subscriptions',
        unsubscribeToTopic: '/alert/subscriptions',
        getSubscriptions: '/alert/subscriptions',
        restoreSubscriptions: '/alert/subscriptions/restore',
        getUserAlerts: '/alert',
        apiWebSocketRooms: {
            WEB_SOCKET_URL: 'https://notification-service-17633123551.europe-west8.run.app',
            CONNECTION: 'connect',
            DISCONNECTION: 'disconnect',
            REGISTRATION: 'register',
            REGISTRATION_OUTCOME: 'registered',
        },
    },
};

export { API_HOST, API_PORT, API_VERSION, config };
