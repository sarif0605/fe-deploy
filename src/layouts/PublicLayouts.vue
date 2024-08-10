<template>
  <div class="relative">
    <NavbarComponent />
    <main class="w-full h-full bg-base-200">
      <RouterView v-slot="{ Component, route }">
        <Transition :duration="{ enter: 550, leave: 800 }" name="nested">
          <component :is="Component" :key="route.path" />
        </Transition>
      </RouterView>
    </main>
  </div>
  <!-- <FooterView /> -->
</template>

<script setup>
import NavbarComponent from "@/components/Navbar.vue";
import { RouterView } from "vue-router";
import FooterView from "./FooterView.vue";
</script>

<style scoped>
.nested-enter-active,
.nested-leave-active {
  transition: all 0.3s ease-in-out;
}
.nested-enter-active .inner,
.nested-leave-active .inner {
  transition: all 0.3s ease-in-out;
  transition-delay: 0.25s;
}

.nested-enter-from .inner,
.nested-leave-to .inner {
  transform: translateX(30px);
  opacity: 0;
}

.nested-enter-active .inner {
  transition-delay: 0.25s;
}

.nested-enter-from,
.nested-leave-to {
  opacity: 0;
}

.nested-enter-to,
.nested-leave-from {
  opacity: 1;
}
</style>
