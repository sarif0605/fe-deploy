<template>
  <div class="border-b border-primary pb-2">
    <h2
      class="text-3xl font-medium text-primary tracking-wider capitalize pt-10"
    >
      {{ props.title }}
    </h2>
  </div>
</template>

<script setup>
const props = defineProps({
  title: {
    type: String,
    required: true,
  },
});
</script>
