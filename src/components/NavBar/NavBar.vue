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

                    <li v-if="isAdmin">
                        <router-link to="/sensors" class="text-white hover:text-primary transition duration-300">
                            Sensors
                        </router-link>
                    </li>
                </ul>
            </div>

            <div class="relative flex items-center gap-2">
                <button
                    @click="toggleNotificationModal"
                    class="p-2 rounded-full hover:bg-gray-700 relative flex items-center justify-center"
                    aria-label="Toggle notifications"
                >
                    <span class="font-material-symbols text-3xl text-white"> notifications </span>
                </button>

                <button
                    @click="toggleProfileModal"
                    class="focus:outline-none flex items-center justify-center relative"
                    aria-label="Open profile menu"
                >
                    <img
                        src="../../assets/images/icons8-user-48.png"
                        alt="Profile"
                        class="w-10 h-10 rounded-full cursor-pointer border-2 border-white"
                    />
                </button>

                <div
                    v-if="isNotificationModalOpen"
                    class="fixed inset-0 z-40"
                    @click="toggleNotificationModal"
                    @keydown.enter="toggleNotificationModal"
                    @keydown.space="toggleNotificationModal"
                    role="button"
                    tabindex="0"
                    aria-label="Close notifications"
                ></div>

                <NotificationModal v-if="isNotificationModalOpen" @close="toggleNotificationModal" class="fixed z-50" />

                <div
                    v-if="isProfileModalOpen"
                    class="fixed inset-0 z-40"
                    @click="toggleProfileModal"
                    @keydown.enter="toggleProfileModal"
                    @keydown.space="toggleProfileModal"
                    role="button"
                    tabindex="0"
                    aria-label="Close profile modal"
                ></div>

                <div v-if="isProfileModalOpen" class="absolute top-12 right-0 z-50">
                    <ProfileModal
                        :isOpen="isProfileModalOpen"
                        :isLoggedIn="userStore.isAuthenticated.value"
                        @close="closeProfileModal"
                        @logout="logout"
                    />
                </div>
            </div>
        </div>
    </nav>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useUserStore } from '@/stores/userStore';
import ProfileModal from '@/components/NavBar/ProfileModal.vue';
import NotificationModal from '@/components/Notification/NotificationModal.vue';
import router from '@/router';

const userStore = useUserStore();
const { isAdmin } = userStore;
const isNotificationModalOpen = ref(false);
const toggleNotificationModal = () => {
    isNotificationModalOpen.value = !isNotificationModalOpen.value;
};

const isProfileModalOpen = ref(false);
const toggleProfileModal = () => {
    isProfileModalOpen.value = !isProfileModalOpen.value;
};

const closeProfileModal = () => {
    isProfileModalOpen.value = false;
};

const logout = () => {
    userStore.removeToken();
    router.push('/login');
    closeProfileModal();
};
</script>
