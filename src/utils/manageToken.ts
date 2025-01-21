import { USER_JWT_TOKEN_HEADER } from '@/headers/userHeaders';

function setToken(token: string) {
  localStorage.setItem(USER_JWT_TOKEN_HEADER, token);
}

function getToken(): string {
  return localStorage.getItem(USER_JWT_TOKEN_HEADER) || '';
}

export { setToken, getToken };
