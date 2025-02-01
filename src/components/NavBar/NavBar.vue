<template>
    <nav class="bg-pastelViolet p-4 w-full">
        <div class="flex justify-between items-center">
            <div class="flex flex-col">
                <div class="text-secondary text-2xl font-bold">Emilia Romagna Climate Monitoring</div>

                <ul class="flex space-x-4 mt-2">
                    <li>
                        <router-link to="/" class="text-white hover:text-primary transition duration-300">
                            Home
                        </router-link>
                    </li>
                    <li>
                        <router-link to="/sensors" class="text-white hover:text-primary transition duration-300">
                            Sensors
                        </router-link>
                    </li>
                </ul>
            </div>

            <div class="relative">
                <button @click="toggleModal" class="focus:outline-none">
                    <img
                        src="https://via.placeholder.com/40"
                        alt="Profile"
                        class="w-10 h-10 rounded-full cursor-pointer"
                    />
                </button>

                <ProfileModal :isOpen="isModalOpen" :isLoggedIn="isLoggedIn" @close="closeModal" @logout="logout" />
            </div>
        </div>
    </nav>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import ProfileModal from '@/components/NavBar/ProfileModal.vue';

const isModalOpen = ref(false);

const isLoggedIn = ref(false);

const toggleModal = () => {
    isModalOpen.value = !isModalOpen.value;
};

const closeModal = () => {
    isModalOpen.value = false;
};

const logout = () => {
    isLoggedIn.value = false;
    closeModal();
};
</script>
