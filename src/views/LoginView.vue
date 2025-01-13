<template>
    <form @submit.prevent="handleLogin">
      <div class="container">
        <label for="uname"><b>Username</b></label>
        <input v-model="email" type="text" placeholder="Enter Username" name="uname" required />
  
        <label for="psw"><b>Password</b></label>
        <input v-model="password" type="password" placeholder="Enter Password" name="psw" required />
  
        <button type="submit">Login</button>
      </div>
    </form>
  </template>

<script setup lang="ts">
import { loginUser } from '@/apis/loginApi';
import { ref } from 'vue';
const email = ref('');
const password = ref('');

const handleLogin = async () => {
    console.log("todo");
}

</script>