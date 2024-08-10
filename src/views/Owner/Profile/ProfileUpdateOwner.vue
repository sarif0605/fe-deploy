<template>
  <div class="mx-auto max-w-6xl px-8 rounded-xl py-20 md:py-24">
    <div class="mx-auto max-w-6xl px-8 rounded-xl">
      <form @submit.prevent="handleSubmit">
        <div
          class="absolute top-0 left-0 w-full h-full flex justify-center items-center z-50"
          v-if="authStore.isLoading"
          style="background-color: rgba(0, 0, 0, 0.5)"
        >
          <Loading />
        </div>
        <div role="alert" class="alert alert-error" v-if="authStore.isErr">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6 shrink-0 stroke-current"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <ul>
            <li
              v-for="(msg, index) in authStore.errMsg.general"
              :key="'general-' + index"
            >
              {{ msg }}
            </li>
            <li
              v-for="(errors, field) in authStore.errMsg"
              v-if="field !== 'general'"
              :key="field"
            >
              <ul>
                <li v-for="(msg, index) in errors" :key="index">{{ msg }}</li>
              </ul>
            </li>
          </ul>
        </div>
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

let getMe = reactive({
  name: "",
});
let getProfile = reactive({
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
  authStore.isLoading = true;
  try {
    await authStore.updateUser({ name: getMe.name });
    console.log("update data ", data);
    authStore.isLoading = false;
  } catch (error) {
    authStore.isLoading = false;
    authStore.isErr = true;
    if (error.response && error.response.data.errors) {
      authStore.errMsg = error.response.data.errors;
    } else {
      authStore.errMsg = { general: [error.response.data.message] };
    }
  }
};

const updateUser = async () => {
  authStore.isLoading = true;
  try {
    await authStore.updateProfile({
      age: getProfile.age,
      bio: getProfile.bio,
    });
    authStore.isLoading = false;
    console.log("update data ", data);
  } catch (error) {
    authStore.isLoading = false;
    authStore.isErr = true;
    if (error.response && error.response.data.errors) {
      authStore.errMsg = error.response.data.errors;
    } else {
      authStore.errMsg = { general: [error.response.data.message] };
    }
  }
};

const handleSubmit = () => {
  updateUser();
  updateUserData();
  $toast.success("Berhasil Ubah Data Profile", {
    position: "top-right",
  });
  router.push({ name: "ProfileOwner" });
};
</script>
