import axios from 'axios';
import { config } from '@/config/config';
import {
  API_KEY_HEADER,
  LOGIN_ACTION,
  REGISTER_ACTION,
  USER_ACTION,
  USER_EMAIL_HEADER,
  USER_PASSWORD_HEADER,
} from '@/headers/userHeaders';

const REGISTER_PATH = config.apiBaseUrl + '/authentication/user/register';
const LOGIN_PATH = config.apiBaseUrl + '/authentication/user/login';
const LOGIN_ADMIN_PATH = config.apiBaseUrl + '/authentication/user/admin/login';

function checkEmail(email: string) {
  const emailRegex =
    /(?:[a-z0-9!#$%&'*+/=?^_{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
  return emailRegex.test(email);
}

function checkPassword(password: string) {
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
}

async function loginUser(email: string, password: string) {
  return await axios.post(LOGIN_PATH, {
    [USER_ACTION]: LOGIN_ACTION,
    [USER_EMAIL_HEADER]: email,
    [USER_PASSWORD_HEADER]: password,
  });
}

async function loginAdmin(email: string, password: string, apiKey: string) {
  return await axios.post(LOGIN_ADMIN_PATH, {
    [USER_ACTION]: LOGIN_ACTION,
    [USER_EMAIL_HEADER]: email,
    [USER_PASSWORD_HEADER]: password,
    [API_KEY_HEADER]: apiKey,
  });
}

async function registerUser(email: string, password: string) {
  return await axios.post(REGISTER_PATH, {
    [USER_ACTION]: REGISTER_ACTION,
    [USER_EMAIL_HEADER]: email,
    [USER_PASSWORD_HEADER]: password,
  });
}

export { loginUser, loginAdmin, checkEmail, checkPassword, registerUser };
