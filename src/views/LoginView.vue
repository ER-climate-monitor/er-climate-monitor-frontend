<template>
  <div class="login-container">
    <form
      @submit.prevent="handleLogin"
      class="w-full max-w-md bg-white rounded-lg shadow-lg p-6 space-y-6"
    >
      <h1 class="text-2xl font-bold text-gray-800 text-center">Login</h1>
      <div class="space-y-2">
        <label for="username" class="block text-sm font-medium text-gray-600"> Username </label>
        <input
          type="text"
          id="username"
          v-model="username"
          placeholder="Enter your username"
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

const errorMessage = ref('');
const router = useRouter();

const handleLogin = (username, password) => {
  if (username === 'admin' && password === 'password') {
    router.push('/home');
  } else {
    errorMessage.value = 'Invalid username or password.';
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
