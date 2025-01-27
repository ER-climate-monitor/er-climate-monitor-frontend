import { config } from '@/config/config';
import {
    SENSOR_CRONJOB_DAYS,
    SENSOR_CRONJOB_TIME_HOUR,
    SENSOR_CRONJOB_TIME_MINUTE,
    SENSOR_IP,
    SENSOR_NAME,
    SENSOR_PORT,
    UPDATE_CRONJOB_DAYS,
    UPDATE_NAME_ACTION,
} from '@/headers/sensorHeaders';
import { USER_TOKEN_HEADER } from '@/headers/userHeaders';
import axios from 'axios';

const GET_ALL_SENSOR_PATH = config.apiBaseUrl + '/sensor/all';
const SHUT_DOWN_SENSOR_PATH = config.apiBaseUrl + '/sensor/shutdown';
const UPDATE_SENSOR_PATH = config.apiBaseUrl + '/sensor/update';

function checkSensorDays(days: string) {
    const regex = /^[0-6]-[0-6]$/;
    if (!regex.test(days)) {
        return false;
    }
    const splitted_days = days.split('-');
    return splitted_days[0] <= splitted_days[1];
}

async function getAllSensors(token: string) {
    const headers = { [USER_TOKEN_HEADER]: token };
    return await axios.get(GET_ALL_SENSOR_PATH, { headers: headers });
}

async function shutDownSensorApi(token: string, ip: string, port: number) {
    const headers = { [USER_TOKEN_HEADER]: token };
    const data = { [SENSOR_IP]: ip, [SENSOR_PORT]: port };
    return await axios.delete(SHUT_DOWN_SENSOR_PATH, {
        headers: headers,
        params: data,
    });
}

async function updateSensorApi(token: string, ip: string, port: string, newInformation: { [key: string]: string }) {
    const headers = { [USER_TOKEN_HEADER]: token };
    const data: { [key: string]: string } = {
        [SENSOR_IP]: ip,
        [SENSOR_PORT]: port,
    };
    Object.keys(newInformation).forEach((key) => {
        data[key] = newInformation[key];
    });
    return await axios.put(UPDATE_SENSOR_PATH, data, { headers: headers });
}

async function updateSensorName(token: string, ip: string, port: number, newName: string) {
    return await updateSensorApi(token, ip, String(port), { action: UPDATE_NAME_ACTION, [SENSOR_NAME]: newName });
}

async function updateSensorCronJobDays(token: string, ip: string, port: number, days: string) {
    return await updateSensorApi(token, ip, String(port), { action: UPDATE_CRONJOB_DAYS, [SENSOR_CRONJOB_DAYS]: days });
}

async function updateSensorCronJobTime(token: string, ip: string, port: number, hour: string, minute: string) {
    return await updateSensorApi(token, ip, String(port), {
        action: UPDATE_CRONJOB_DAYS,
        [SENSOR_CRONJOB_TIME_HOUR]: hour,
        [SENSOR_CRONJOB_TIME_MINUTE]: minute,
    });
}

export {
    getAllSensors,
    shutDownSensorApi,
    updateSensorName,
    checkSensorDays,
    updateSensorCronJobDays,
    updateSensorCronJobTime,
};
