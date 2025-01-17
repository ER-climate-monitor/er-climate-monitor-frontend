export const fetchSensorLocations = async (sensorType: string) => {
  if (!sensorType) return [];

  try {
    const response = await fetch(
      `http://localhost:3000/v0/sensor/${sensorType.toLowerCase()}/positions`,
    );

    if (!response.ok) throw new Error('Failed to fetch sensor locations');

    const data = await response.json();
    return data.undefined.map((item: { latitude: number; longitude: number }) => ({
      latitude: item.latitude,
      longitude: item.longitude,
    }));
  } catch (error) {
    console.error('Error fetching sensor locations:', error);
    return [];
  }
};
