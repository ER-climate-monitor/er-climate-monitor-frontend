import axios from 'axios';
import type { SensorLocation } from '@/types/SensorLocation';

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
