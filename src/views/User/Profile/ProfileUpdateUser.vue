<template>
  <div class="mx-auto max-w-6xl px-8 rounded-xl py-20 md:py-24">
    <div class="mx-auto max-w-6xl px-8 rounded-xl">
      <form @submit.prevent="handleSubmit">
        <div class="mt-4">
          <label for="name" class="block">Name:</label>
          <input
            v-model="getMe.name"
            id="name"
            type="text"
            class="border p-2 rounded w-full"
            required
          />
        </div>
        <div class="mt-4">
          <label for="age" class="block">Age:</label>
          <input
            v-model="getProfile.age"
            id="age"
            type="number"
            class="border p-2 rounded w-full"
            required
          />
        </div>
        <div class="mt-4">
          <label for="biodata" class="block">Biodata:</label>
          <input
            v-model="getProfile.bio"
            id="biodata"
            type="text"
            class="border p-2 rounded w-full"
            required
          />
        </div>
        <button
          type="submit"
          class="mt-4 px-4 py-2 bg-green-500 text-white rounded"
        >
          Save Changes
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive, onMounted } from "vue";
import { useAuthStore } from "@/stores/AuthStore";
import { useRouter } from "vue-router";
import { useToast } from "vue-toast-notification";
const $toast = useToast();
const authStore = useAuthStore();
const router = useRouter();

const getMe = reactive({
  name: "",
});
const getProfile = reactive({
  age: "",
  bio: "",
});

const fetchUserData = async () => {
  try {
    const me = await authStore.getUser();
    const profile = await authStore.getProfile();
    getMe.name = me.name;
    getProfile = profile;
    Object.assign(getProfile, profile);
    console.log("User data loaded:", profile.bio);
  } catch (error) {
    console.log("Error loading user data:", error);
  }
};

onMounted(() => {
  fetchUserData();
});

const updateUserData = async () => {
  try {
    await authStore.updateUser({ name: getMe.name });
    console.log("update data ", data);
  } catch (error) {
    console.log("Error updating user data:", error);
  }
};

const updateUser = async () => {
  try {
    await authStore.updateProfile({
      age: getProfile.age,
      bio: getProfile.bio,
    });
    console.log("update data ", data);
  } catch (error) {
    console.log("Error updating user data:", error);
  }
};

const handleSubmit = () => {
  updateUser();
  updateUserData();
  $toast.success("Berhasil Ubah Data Profile", {
    position: "top-right",
  });
  router.push({ name: "ProfileUser" });
};
</script>
