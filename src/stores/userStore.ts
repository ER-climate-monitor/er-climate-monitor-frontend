import { USER_JWT_TOKEN_HEADER } from '@/headers/userHeaders';
import { useLocalStorage } from '@vueuse/core';
import { computed } from 'vue';

export const useUserStore = () => {
    const token = useLocalStorage<string>(USER_JWT_TOKEN_HEADER, '');
    const isAuthenticated = computed(() => !!token.value);

    const setToken = (newToken: string) => {
        token.value = newToken;
    };

    const removeToken = () => {
        token.value = null;
        localStorage.removeItem(USER_JWT_TOKEN_HEADER);
    };

    return {
        token,
        isAuthenticated,
        setToken,
        removeToken,
    };
};
