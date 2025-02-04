<template>
    <div class="flex items-center justify-center min-h-screen">
        <form @submit.prevent="handleLogin" class="w-full max-w-md bg-white rounded-lg shadow-lg p-8 space-y-6">
            <h1 class="text-2xl font-bold text-gray-800 text-center">Login</h1>

            <div class="space-y-2">
                <label for="email" class="block text-sm font-bold text-gray-900 text-left"
                    >Email
                    <input
                        type="text"
                        id="email"
                        v-model="email"
                        placeholder="Enter your email"
                        class="w-full px-4 py-2 border-2 border-black rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-700"
                        required
                    />
                </label>
            </div>

            <div class="space-y-2">
                <label for="password" class="block text-sm font-bold text-gray-900"
                    >Password
                    <input
                        type="password"
                        id="password"
                        v-model="password"
                        placeholder="Enter your password"
                        class="w-full px-4 py-2 border-2 border-black rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-700"
                        required
                    />
                </label>
            </div>

            <div class="flex items-center space-x-2">
                <label for="isAdmin" class="text-sm font-medium text-gray-900"
                    >Log in as Admin
                    <input
                        type="checkbox"
                        id="isAdmin"
                        v-model="isAdmin"
                        class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                </label>
            </div>

            <div v-if="isAdmin" class="space-y-2">
                <label for="apiKey" class="block text-sm font-bold text-gray-900"
                    >API Key
                    <input
                        type="text"
                        id="apiKey"
                        v-model="apiKey"
                        placeholder="Enter your API key"
                        class="w-full px-4 py-2 border-2 border-black rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-700"
                        required
                    />
                </label>
            </div>

            <button
                type="submit"
                class="w-full bg-primary text-black py-2 rounded-lg font-bold hover:bg-blue-400 transition duration-300"
            >
                Login
            </button>

            <button
                type="button"
                @click="goToRegister"
                class="w-full bg-gray-600 text-white py-2 rounded-lg font-medium hover:bg-gray-700 transition duration-300"
            >
                Register
            </button>

            <ErrorMessage :message="errorMessage" />
        </form>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import ErrorMessage from '@/components/Login/ErrorMessage.vue';
import { checkEmail, checkPassword, loginAdmin, loginUser } from '@/apis/authenticationApi';
import { AxiosError, HttpStatusCode } from 'axios';
import { USER_JWT_TOKEN_HEADER } from '@/headers/userHeaders';
import { useUserStore } from '@/stores/userStore';

const userStore = useUserStore();

const email = ref('');
const password = ref('');
const errorMessage = ref('');
const isAdmin = ref(false);
const apiKey = ref('');
const router = useRouter();

const goToRegister = () => {
    router.push('/register');
};

const handleLogin = async (e: Event) => {
    e.preventDefault();

    if (!checkEmail(email.value)) {
        errorMessage.value = 'Wrong Email format';
        return;
    }

    if (!checkPassword(password.value)) {
        errorMessage.value = 'Wrong Password format';
        return;
    }

    const loginFn = isAdmin.value ? loginAdmin : loginUser;

    try {
        const response = await loginFn(email.value, password.value, isAdmin.value ? apiKey.value : '');
        console.log(response);
        if (response.status === HttpStatusCode.Ok) {
            userStore.setToken(response.data[USER_JWT_TOKEN_HEADER]);
            userStore.setUser({ email: response.data['userEmail'], isAdmin: response.data['userRole'] == 'admin' });
            router.push('/');
        }
    } catch (error) {
        handleLoginError(error);
    }
};

const handleLoginError = (error: unknown) => {
    if (error instanceof AxiosError && error.response) {
        if (error.response.status === HttpStatusCode.Unauthorized) {
            errorMessage.value = 'Wrong Api Key';
        } else {
            errorMessage.value = 'Invalid username or password.';
        }
    } else {
        errorMessage.value = 'An unknown error occurred.';
    }
};
</script>
