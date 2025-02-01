<template>
    <div v-if="isOpen" class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg">
        <div v-if="!isLoggedIn" class="p-4">
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
            <button
                @click="handleLogout"
                class="block w-full text-left text-gray-700 hover:bg-gray-100 px-4 py-2 rounded"
            >
                Sign Out
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
defineProps({
    isOpen: {
        type: Boolean,
        required: true,
    },
    isLoggedIn: {
        type: Boolean,
        required: true,
    },
});

const emit = defineEmits(['close', 'logout']);

const closeModal = () => {
    emit('close');
};

const handleLogout = () => {
    emit('logout');
    closeModal();
};
</script>
