<template>
  <div class="bg-white p-6 rounded-lg shadow-md flex items-center">
    <div class="flex-1">
      <h3 class="text-lg font-semibold">{{ title }}</h3>
      <p class="text-2xl font-bold">{{ count }}</p>
    </div>
    <i :class="icon" class="text-4xl ml-4"></i>
  </div>
</template>

<script setup>
const props = defineProps({
  title: String,
  count: Number,
  icon: String,
});
</script>
