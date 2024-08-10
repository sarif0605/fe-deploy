<script setup>
import TestDrawer from "@/components/Owner/Drawer.vue";
import TestNavbar from "@/components/Owner/NavbarAdmin.vue";
import { useThemeStore } from "@/stores/ThemeStore";

const app = useThemeStore();
</script>

<template>
  <test-navbar />
  <test-drawer v-model="app.drawer">
    <template #content>
      <main
        :class="{ 'ml-64': app.drawer, 'ml-0': !app.drawer }"
        class="transition-all duration-300"
      >
        <router-view />
      </main>
    </template>
  </test-drawer>
</template>

<!-- <script setup>
import TestDrawer from "@/components/Owner/Drawer.vue";
import TestNavbar from "@/components/Owner/NavbarAdmin.vue";
import { useThemeStore } from "@/stores/ThemeStore";

const app = useThemeStore();
</script>

<template>
  <test-navbar />
  <test-drawer v-model="app.drawer">
    <template #content>
      <main><router-view /></main>
    </template>
  </test-drawer>
</template> -->
