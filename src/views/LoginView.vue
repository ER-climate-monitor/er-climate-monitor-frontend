<template>
  <div class="login-container">
    <form
      @submit.prevent="handleLogin"
      class="w-full max-w-md bg-white rounded-lg shadow-lg p-6 space-y-6"
    >
      <h1 class="text-2xl font-bold text-gray-800 text-center">Login</h1>
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
      <div class="flex items-center space-x-2">
        <input
          type="checkbox"
          id="isAdmin"
          v-model="isAdmin"
          class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
        />
        <label for="isAdmin" class="text-sm font-medium text-gray-600"> Log in as Admin </label>
      </div>
      <div v-if="isAdmin" class="space-y-2">
        <label for="apiKey" class="block text-sm font-medium text-gray-600"> API Key </label>
        <input
          type="text"
          id="apiKey"
          v-model="apiKey"
          placeholder="Enter your API key"
          class="w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 text-gray-600 focus:outline-none"
          required
        />
      </div>
      <button
        type="submit"
        class="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition duration-300"
      >
        Login
      </button>

      <ErrorMessage :message="errorMessage" />
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import ErrorMessage from '@/components/Login/ErrorMessage.vue';
import { checkEmail, checkPassword, loginAdmin, loginUser } from '@/apis/loginApi';
import { AxiosError, HttpStatusCode, type AxiosResponse } from 'axios';

const email = ref('');
const password = ref('');
const errorMessage = ref('');
const isAdmin = ref(false);
const apiKey = ref('');
const router = useRouter();

const handleLogin = async (e: Event) => {
  e.preventDefault();
  if (checkEmail(email.value) && checkPassword(password.value)) {
    try {
      let response: AxiosResponse<unknown, unknown>;
      if (isAdmin.value) {
        response = await loginAdmin(email.value, password.value, apiKey.value);
      } else {
        response = await loginUser(email.value, password.value);
      }
      if (response.status === HttpStatusCode.Ok) {
        router.push('/home');
      }
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        if (error.status === HttpStatusCode.Unauthorized) {
          errorMessage.value = 'Wrong Api Key';
        }
      } else {
        errorMessage.value = 'Invalid username or password.';
      }
    }
  }
};
</script>

<style scoped>
.login-container {
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
