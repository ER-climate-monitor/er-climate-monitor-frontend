import { config } from '@/config/config';
import type { Topic, TopicQuery } from '@/stores/notificationStore';
import axios from 'axios';
import Logger from 'js-logger';

async function fetchNotificationTopics(): Promise<Topic[] | null> {
  try {
    const response = await axios.get(`${config.apiBaseUrl}${config.apiAlertTopics}`);
    return response.data;
  } catch (error) {
    Logger.error('Failed to load topics: ', error);
    return null;
  }
}

async function fetchQueriesForTopic(topicId: string): Promise<TopicQuery[] | null> {
  try {
    const response = await axios.get(
      `${config.apiBaseUrl}${config.apiAlertTopics}${config.apiFetchQueriesForTopicUrl}`,
      {
        params: { topic: topicId },
      },
    );
    return response.data;
  } catch (error) {
    Logger.error(`Failed to load queries for topic ${topicId}:`, error);
    return null;
  }
}

export { fetchNotificationTopics, fetchQueriesForTopic };
