import { config } from '@/config/config';
import { USER_JWT_TOKEN_HEADER } from '@/headers/userHeaders';
import axios from 'axios';

const GET_ALL_SENSOR_PATH = config.apiBaseUrl + '/sensor/all';
// const SHUT_DOWN_SENSOR_PATH = config.apiBaseUrl + '/sensor/shutdown';

async function getAllSensors(token: string) {
  const headers = { [USER_JWT_TOKEN_HEADER]: token };
  return await axios.get(GET_ALL_SENSOR_PATH, { headers });
}

async function shutDownSensor(token: string) {
  return token;
}

export { getAllSensors, shutDownSensor };
