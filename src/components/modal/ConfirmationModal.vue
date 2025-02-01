<template>
    <div class="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
        <div class="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 class="text-lg font-bold text-gray-800 mb-4">Confirm Action</h2>
            <p class="text-gray-600 mb-4">Are you sure you want to proceed?</p>
            <div class="flex justify-end space-x-4">
                <button
                    @click="$emit('cancel')"
                    name="Confirm action"
                    class="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                >
                    Cancel
                </button>
                <button
                    @click="$emit('confirm')"
                    name="Cancel action"
                    class="px-4 py-2 bg-secondary text-white rounded hover:bg-red-700"
                >
                    Confirm
                </button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
defineEmits(['confirm', 'cancel']);
</script>
