export interface Topic {
  id: string;
  name: string;
  description: string;
}

export interface TopicQuery {
  id: string;
  topicId: string;
  name: string;
  description: string;
}

export interface Notification {
  id: string;
  type: string;
  summary: string;
  description: string;
  timestamp: string;
  read: boolean;
  topicId: string;
  queryId: string;
}

export interface NotificationSubscription {
  topic: Topic;
  query: TopicQuery;
  uid: string;
  topicAddr: string;
}

export const getAlertIcon = (alertType: string): string => {
  const icons: { [key: string]: string } = {
    'hydro-level': '💧',
    temperature: '🌡️',
  };
  return icons[alertType] || '⚠️';
};
