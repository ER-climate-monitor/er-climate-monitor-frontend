<template>
    <div v-if="isOpen" class="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg p-4">
        <div v-if="!isAuthenticated" class="p-4">
            <router-link
                to="/login"
                class="block text-gray-700 hover:bg-gray-100 px-4 py-2 rounded"
                @click="closeModal"
            >
                Login
            </router-link>
            <router-link
                to="/register"
                class="block text-gray-700 hover:bg-gray-100 px-4 py-2 rounded"
                @click="closeModal"
            >
                Register
            </router-link>
        </div>
        <div v-else class="p-4">
            <div class="text-gray-700 font-semibold mb-2">User Info</div>

            <div class="text-gray-600 text-sm truncate">📧 {{ userEmail }}</div>

            <div v-if="isAdmin" class="text-red-600 text-xs font-bold">👑 Admin</div>

            <button
                @click="handleLogout"
                class="block w-full text-left text-gray-700 hover:bg-gray-100 px-4 py-2 rounded mt-2"
            >
                Log Out
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useUserStore } from '@/stores/userStore';

defineProps({
    isOpen: {
        type: Boolean,
        required: true,
    },
});

const emit = defineEmits(['close', 'logout']);
const userStore = useUserStore();
const { userEmail, isAdmin, isAuthenticated } = userStore;
console.log(isAdmin);

const closeModal = () => {
    emit('close');
};

const handleLogout = () => {
    userStore.removeToken();
    emit('logout');
    closeModal();
};
</script>
