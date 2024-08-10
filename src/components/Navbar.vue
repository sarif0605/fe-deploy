<template>
  <div
    class="navbar bg-base-100 fixed border-b-2 border-primary z-50 text-primary"
  >
    <div class="navbar-start">
      <div class="dropdown">
        <div tabindex="0" role="button" class="btn btn-ghost lg:hidden">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 6h16M4 12h8m-8 6h16"
            />
          </svg>
        </div>
        <ul
          tabindex="0"
          class="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
        >
          <li><RouterLink :to="{ name: 'Home' }">Home</RouterLink></li>
          <li><RouterLink :to="{ name: 'Category' }">Category</RouterLink></li>
          <li><RouterLink :to="{ name: 'Book' }">Book</RouterLink></li>
          <li v-if="!authStore.userToken">
            <RouterLink class="sm:hidden" :to="{ name: 'Login' }"
              >Login</RouterLink
            >
          </li>
          <li v-if="!authStore.userToken">
            <RouterLink class="sm:hidden" :to="{ name: 'Register' }"
              >Register</RouterLink
            >
          </li>
          <template
            v-if="
              authStore.userData &&
              authStore.userData.role &&
              authStore.userData.role.name === 'user'
            "
          >
            <li>
              <RouterLink :to="{ name: 'HistoryBorrow' }">Borrow</RouterLink>
            </li>
          </template>
        </ul>
      </div>
      <a class="btn btn-ghost text-xl">Perpustakaan</a>
    </div>
    <div class="navbar-center hidden lg:flex">
      <ul class="menu menu-horizontal px-1">
        <li><RouterLink :to="{ name: 'Home' }">Home</RouterLink></li>
        <li><RouterLink :to="{ name: 'Category' }">Category</RouterLink></li>
        <li><RouterLink :to="{ name: 'Book' }">Book</RouterLink></li>
        <template
          v-if="
            authStore.userData &&
            authStore.userData.role &&
            authStore.userData.role.name === 'user'
          "
        >
          <li>
            <RouterLink :to="{ name: 'HistoryBorrow' }">Borrow</RouterLink>
          </li>
        </template>
      </ul>
    </div>
    <div class="navbar-end">
      <ul class="menu menu-horizontal px-4 space-x-2">
        <li v-if="authStore.userToken === null">
          <RouterLink
            class="hidden sm:btn sm:btn-secondary"
            :to="{ name: 'Login' }"
            >Login</RouterLink
          >
        </li>
        <li v-if="authStore.userToken === null">
          <RouterLink
            class="hidden sm:btn sm:btn-accent"
            :to="{ name: 'Register' }"
            >Register</RouterLink
          >
        </li>
        <li v-if="authStore.userToken !== null">
          <details>
            <summary>User</summary>
            <ul class="p-2">
              <li>
                <RouterLink :to="{ name: 'ProfileUser' }">Profile</RouterLink>
              </li>
              <li><button @click="showLogoutModal = true">Logout</button></li>
            </ul>
          </details>
        </li>
      </ul>
      <label class="swap swap-rotate">
        <input
          type="checkbox"
          class="theme-controller"
          value="synthwave"
          @change="toggleTheme"
          :checked="themeStore.currentTheme === 'light'"
        />
        <svg
          class="swap-off h-8 w-8 fill-current"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
        >
          <path
            class="bg-white"
            d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z"
          />
        </svg>
        <svg
          class="swap-on h-8 w-8 fill-current"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
        >
          <path
            class="bg-white"
            d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z"
          />
        </svg>
      </label>
    </div>
    <Logout
      :visible="showLogoutModal"
      @update:visible="showLogoutModal = $event"
      @confirmLogout="confirmLogout"
    />
  </div>
</template>
<script setup>
import { useAuthStore } from "@/stores/AuthStore";
import { useThemeStore } from "@/stores/ThemeStore";
import { ref, onMounted, watch } from "vue";
import Logout from "./Logout.vue";

const authStore = useAuthStore();
const themeStore = useThemeStore();
const showLogoutModal = ref(false);

const confirmLogout = () => {
  authStore.logoutUser();
  showLogoutModal.value = false;
  console.log("berhasil logout");
};

const toggleTheme = () => {
  themeStore.toggleTheme();
};

onMounted(() => {
  document.documentElement.setAttribute("data-theme", themeStore.currentTheme);
});

watch(
  () => themeStore.currentTheme,
  (newTheme) => {
    document.documentElement.setAttribute("data-theme", newTheme);
  }
);
</script>
