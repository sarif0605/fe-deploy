<template>
  <div class="container mx-auto max-w-6xl px-8 md:py-28 py-24 bg-inherit">
    <div
      v-if="getMe && getProfile"
      class="card mx-auto bg-primary text-primary-content w-96"
    >
      <div class="card-body">
        <h1 class="text-2xl font-bold">User Profile</h1>
        <p class="mt-2">Name: {{ getMe.name ? getMe.name : "-" }}</p>
        <p class="mt-2">Email: {{ getMe.email ? getMe.email : "-" }}</p>
        <p class="mt-2">Age: {{ getProfile.age ? getProfile.age : "-" }}</p>
        <p class="mt-2">Biodata: {{ getProfile.bio ? getProfile.bio : "-" }}</p>

        <button
          class="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
          @click="updateUserData"
        >
          Update Data
        </button>
      </div>
    </div>
    <div
      v-else-if="getMe"
      class="card mx-auto bg-primary text-primary-content w-96"
    >
      <div class="card-body">
        <h1 class="text-2xl font-bold">User Profile</h1>
        <p class="mt-2">Name : {{ getMe.name }}</p>
        <p class="mt-2">Email: {{ getMe.email }}</p>
        <p class="mt-2">Age:</p>
        <p class="mt-2">Address:</p>
        <p class="mt-2">Biodata:</p>

        <button
          class="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
          @click="updateUserData"
        >
          Update Data
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useAuthStore } from "@/stores/AuthStore";
import { useRouter } from "vue-router";

const authStore = useAuthStore();
const router = useRouter();
const getMe = ref(null);
const getProfile = ref(null);

const fetchUserData = async () => {
  try {
    const dataMe = await authStore.getUser();
    const profile = await authStore.getProfile();
    getMe.value = dataMe;
    getProfile.value = profile;
    console.log("User data loaded:", getProfile);
  } catch (error) {
    console.log("Error loading user data:", error);
  }
};

const updateUserData = () => {
  router.push({ name: "ProfileUpdateUser" });
};

onMounted(() => {
  fetchUserData();
});
</script>
