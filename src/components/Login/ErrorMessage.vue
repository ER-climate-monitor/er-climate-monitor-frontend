<template>
  <p v-if="message" class="error">{{ message }}</p>
</template>

<script setup>
defineProps({
  message: {
    type: String,
    default: '',
  },
})
</script>

<style scoped>
.error {
  color: red;
  font-size: 1rem;
  margin-top: 20px;
}
</style>
