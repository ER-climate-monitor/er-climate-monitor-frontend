import axios from 'axios';
import type { SensorLocation } from '@/types/SensorLocation';
import type { Detection } from '@/types/SensorDetection';
import { USER_TOKEN_HEADER } from '@/headers/userHeaders';
import { config } from '@/config/config';


export const fetchSensorLocations = async (sensorType: string, token: string): Promise<SensorLocation[]> => {
    if (!sensorType) return [];

    try {
        const headers = { [USER_TOKEN_HEADER]: token };
        const response = await axios.get<SensorLocation[]>(
            `${config.apiBaseUrl}/v0/api/detection/${sensorType.toLowerCase()}/locations`,
            { headers: headers },
        );

        return response.data;
    } catch (error) {
        console.error('Error fetching sensor locations:', error);
        return [];
    }
};

export const fetchSensorDetections = async (
    sensorType: string,
    sensorId: string,
    token: string,
): Promise<Detection[]> => {
    if (!sensorType || !sensorId) return [];

    try {
        const headers = { [USER_TOKEN_HEADER]: token };
        const response = await axios.get<Detection[]>(
            `${config.apiBaseUrl}/v0/api/detection/${sensorType.toLowerCase()}/${sensorId}/detections?last=15`,
            { headers: headers },
        );

        return response.data;
    } catch (error) {
        console.error('Error fetching sensor detections:', error);
        return [];
    }
};
