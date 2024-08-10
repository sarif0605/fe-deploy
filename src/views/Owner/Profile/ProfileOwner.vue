<template>
  <div
    class="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-28 md:py-24 bg-inherit"
  >
    <div v-if="authStore.isLoading" class="flex items-center justify-center">
      <Loading />
    </div>
    <div
      v-if="getMe && getProfile"
      class="card mx-auto bg-primary text-primary-content w-full sm:w-96"
    >
      <div class="card-body">
        <h1 class="text-xl sm:text-2xl font-bold">User Profile</h1>
        <p class="mt-2 text-sm sm:text-base">
          Name: {{ getMe.name ? getMe.name : "-" }}
        </p>
        <p class="mt-2 text-sm sm:text-base">
          Email: {{ getMe.email ? getMe.email : "-" }}
        </p>
        <p class="mt-2 text-sm sm:text-base">
          Age: {{ getProfile.age ? getProfile.age : "-" }}
        </p>
        <p class="mt-2 text-sm sm:text-base">
          Biodata: {{ getProfile.bio ? getProfile.bio : "-" }}
        </p>

        <button
          class="mt-4 px-4 py-2 bg-blue-500 text-white rounded w-full"
          @click="updateUserData"
        >
          Update Data
        </button>
      </div>
    </div>
    <div
      v-else-if="getMe"
      class="card mx-auto bg-primary text-primary-content w-full sm:w-96"
    >
      <div class="card-body">
        <h1 class="text-xl sm:text-2xl font-bold">User Profile</h1>
        <p class="mt-2 text-sm sm:text-base">Name: {{ getMe.name }}</p>
        <p class="mt-2 text-sm sm:text-base">Email: {{ getMe.email }}</p>
        <p class="mt-2 text-sm sm:text-base">Age:</p>
        <p class="mt-2 text-sm sm:text-base">Address:</p>
        <p class="mt-2 text-sm sm:text-base">Biodata:</p>

        <button
          class="mt-4 px-4 py-2 bg-blue-500 text-white rounded w-full"
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
import Loading from "@/components/Loading.vue";
const authStore = useAuthStore();
const router = useRouter();
const getMe = ref(null);
const getProfile = ref(null);

const fetchUserData = async () => {
  authStore.isLoading = true;
  try {
    const dataMe = await authStore.getUser();
    const profile = await authStore.getProfile();
    getMe.value = dataMe;
    getProfile.value = profile.data;
    console.log("User data loaded:", profile.data);
  } catch (error) {
    console.log("Error loading user data:", error);
  } finally {
    authStore.isLoading = false;
  }
};

const updateUserData = () => {
  router.push({ name: "ProfileOwnerUpdate" });
};

onMounted(() => {
  fetchUserData();
});
</script>
