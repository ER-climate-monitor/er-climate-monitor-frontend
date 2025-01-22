import { config } from '@/config/config';
import { SENSOR_IP, SENSOR_PORT } from '@/headers/sensorHeaders';
import { USER_JWT_TOKEN_HEADER } from '@/headers/userHeaders';
import axios from 'axios';

const GET_ALL_SENSOR_PATH = config.apiBaseUrl + '/sensor/all';
const SHUT_DOWN_SENSOR_PATH = config.apiBaseUrl + '/sensor/shutdown';

async function getAllSensors(token: string) {
  const headers = { [USER_JWT_TOKEN_HEADER]: token };
  return await axios.get(GET_ALL_SENSOR_PATH, { headers });
}

async function shutDownSensorApi(token: string, ip: string, port: number) {
  const headers = { [USER_JWT_TOKEN_HEADER]: token };
  const data = { [SENSOR_IP]: ip, [SENSOR_PORT]: port };
  return await axios.delete(SHUT_DOWN_SENSOR_PATH, {
    headers,
    data,
  });
}

export { getAllSensors, shutDownSensorApi };
