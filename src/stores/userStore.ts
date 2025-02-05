import { USER_JWT_TOKEN_HEADER } from '@/headers/userHeaders';
import { useLocalStorage } from '@vueuse/core';
import { computed } from 'vue';

export type User = {
    email: string;
    isAdmin: boolean;
};

export const useUserStore = () => {
    const token = useLocalStorage<string>(USER_JWT_TOKEN_HEADER, '');
    const isAuthenticated = computed(() => !!token.value);

    const userEmail = useLocalStorage<string>('userEmail', null);
    const isAdmin = useLocalStorage<boolean>('isAdmin', false);

    const setToken = (newToken: string) => {
        token.value = newToken;
    };

    const setUser = (userData: User) => {
        userEmail.value = userData.email;
        isAdmin.value = userData.isAdmin;
    };

    const removeToken = () => {
        localStorage.removeItem(USER_JWT_TOKEN_HEADER);
        localStorage.removeItem('userEmail');
        localStorage.removeItem('isAdmin');
    };

    const getUserFromStorage = () => {
        const storedUser = localStorage.getItem('user');
        return storedUser ? JSON.parse(storedUser) : null;
    };

    return {
        token,
        isAuthenticated,
        userEmail,
        isAdmin,
        setToken,
        setUser,
        removeToken,
        getUserFromStorage,
    };
};
