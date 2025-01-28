import axios from 'axios';
import type { SensorLocation } from '@/types/SensorLocation';
import type { Detection } from '@/types/SensorDetection';

export const fetchSensorLocations = async (sensorType: string): Promise<SensorLocation[]> => {
    if (!sensorType) return [];

    try {
        const response = await axios.get<SensorLocation[]>(
            `http://localhost:3000/v0/sensor/${sensorType.toLowerCase()}/locations`,
        );

        return response.data;
    } catch (error) {
        console.error('Error fetching sensor locations:', error);
        return [];
    }
};

export const fetchSensorDetections = async (sensorType: string, sensorId: string): Promise<Detection[]> => {
    if (!sensorType || !sensorId) return [];

    try {
        const response = await axios.get<Detection[]>(
            `http://localhost:3000/v0/sensor/${sensorType.toLowerCase()}/${sensorId}/detections?last=15`,
        );

        return response.data;
    } catch (error) {
        console.error('Error fetching sensor detections:', error);
        return [];
    }
};
