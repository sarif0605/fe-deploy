<template>
  <div class="callback">
    <h2>Processing Google login...</h2>
  </div>
</template>

<script setup>
import { useAuthStore } from "@/stores/AuthStore";
import { onMounted } from "vue";

const authStore = useAuthStore();

onMounted(() => {
  authStore.handleGoogleCallback();
});
</script>
