const API_HOST = import.meta.env.API_HOST || 'localhost';
const API_PORT = import.meta.env.API_POST || '3000';
const API_VERSION = import.meta.env.API_VERSION || 'v0';

export const config = {
    apiBaseUrl: `http://${API_HOST}:${API_PORT}/${API_VERSION}/api`,
    apiAlertTopics: '/sensor/all',
    apiSubscribeToTopic: '/alert/subscribe',
};
