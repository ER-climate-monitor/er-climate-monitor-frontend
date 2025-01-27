<template>
    <div class="register-container">
        <form @submit.prevent="handleRegister" class="w-full max-w-md bg-white rounded-lg shadow-lg p-6 space-y-6">
            <h1 class="text-2xl font-bold text-gray-800 text-center">Register</h1>
            <div class="space-y-2">
                <label for="email" class="block text-sm font-medium text-gray-600"> Email </label>
                <input
                    type="text"
                    id="email"
                    v-model="email"
                    placeholder="Enter your email"
                    class="w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 text-gray-600 focus:outline-none"
                    required
                />
            </div>
            <div class="space-y-2">
                <label for="password" class="block text-sm font-medium text-gray-600"> Password </label>
                <input
                    type="password"
                    id="password"
                    v-model="password"
                    placeholder="Enter your password"
                    class="w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 text-gray-600 focus:outline-none"
                    required
                />
            </div>
            <button
                type="submit"
                class="w-full bg-green-600 text-white py-2 rounded-lg font-medium hover:bg-green-700 transition duration-300"
            >
                Register
            </button>
            <button
                type="button"
                @click="goToLogin"
                class="w-full bg-gray-600 text-white py-2 rounded-lg font-medium hover:bg-gray-700 transition duration-300"
            >
                Login
            </button>
            <ErrorMessage :message="errorMessage" />
        </form>
    </div>
</template>

<script setup lang="ts">
import ErrorMessage from '@/components/Login/ErrorMessage.vue';
import { checkEmail, checkPassword, registerUser } from '@/apis/authenticationApi';
import { USER_JWT_TOKEN_HEADER } from '@/headers/userHeaders';
import { setToken } from '@/utils/manageToken';
import { HttpStatusCode } from 'axios';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const email = ref('');
const password = ref('');
const errorMessage = ref('');
const router = useRouter();

const handleRegister = async (e: Event) => {
    e.preventDefault();
    if (!checkEmail(email.value)) {
        errorMessage.value = 'Wrong Email Format';
    }

    if (!checkPassword(password.value)) {
        errorMessage.value = 'Wrong Password Format';
    }

    try {
        const response = await registerUser(email.value, password.value);

        if (response.status === HttpStatusCode.Created) {
            setToken(response.data[USER_JWT_TOKEN_HEADER]);
            router.push('/home');
        }
    } catch (error) {
        if (error instanceof Error) {
            errorMessage.value = error.message;
        }
    }
};

const goToLogin = (e: Event) => {
    e.preventDefault();
    router.push('/login');
};
</script>

<style scoped>
.register-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100vh;
}

h1 {
    font-size: 2rem;
    margin-bottom: 20px;
}
</style>
