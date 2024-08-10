<template>
  <div class="hero bg-current min-h-screen flex items-center justify-center">
    <div class="card bg-base-100 w-full max-w-md lg:max-w-lg shadow-2xl">
      <form @submit.prevent="handleSubmit" class="card-body">
        <div
          class="absolute top-0 left-0 w-full h-full flex justify-center items-center z-50"
          v-if="authStore.isLoading"
          style="background-color: rgba(0, 0, 0, 0.5)"
        >
          <Loading />
        </div>
        <router-link :to="{ name: 'Home' }"
          ><span class="pi pi-arrow-left"></span
        ></router-link>
        <h2 class="text-2xl font-bold mb-6 text-center">{{ props.name }}</h2>
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
        <div v-if="props.isRegister" class="grid md:grid-cols-2 gap-4">
          <div class="form-control">
            <label class="label">
              <span class="label-text">Email</span>
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              v-model="userInput.email"
              class="input input-bordered"
              required
            />
          </div>
          <div class="form-control">
            <label class="label">
              <span class="label-text">Name</span>
            </label>
            <input
              type="text"
              v-model="userInput.name"
              placeholder="Enter your name"
              class="input input-bordered"
              required
            />
          </div>
          <div class="form-control">
            <label class="label">
              <span class="label-text">Password</span>
            </label>
            <input
              type="password"
              v-model="userInput.password"
              placeholder="Enter your password"
              class="input input-bordered"
              required
            />
          </div>
          <div class="form-control">
            <label class="label">
              <span class="label-text">Konfirmasi Password</span>
            </label>
            <input
              type="password"
              v-model="userInput.password_confirmation"
              placeholder="Enter your konfirmasi password"
              class="input input-bordered"
              required
            />
          </div>
        </div>
        <div v-else>
          <div class="form-control">
            <label class="label">
              <span class="label-text">Email</span>
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              v-model="userInput.email"
              class="input input-bordered"
              required
            />
          </div>
          <div class="form-control">
            <label class="label">
              <span class="label-text">Password</span>
            </label>
            <input
              type="password"
              v-model="userInput.password"
              placeholder="Enter your password"
              class="input input-bordered"
              required
            />
          </div>
        </div>
        <div class="form-control mt-4">
          <button class="btn btn-primary w-full">{{ props.name }}</button>
        </div>
        <div class="form-control mt-4">
          <button
            @click="authStore.loginWithGoogle"
            type="button"
            class="btn btn-outline w-full flex items-center justify-center"
          >
            <img
              src="https://developers.google.com/identity/images/g-logo.png"
              alt="Google Logo"
              class="w-5 h-5 mr-2"
            />
            {{
              props.isRegister ? "Login with Google" : "Register with Google"
            }}
          </button>
        </div>
      </form>
      <p class="text-center my-2">
        {{ props.isRegister ? "Have an account? " : "Don't have an account? " }}
        <RouterLink :to="{ name: props.isRegister ? 'Login' : 'Register' }">
          {{ props.isRegister ? "Login" : "Register" }}
        </RouterLink>
      </p>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from "@/stores/AuthStore";
import { reactive, ref } from "vue";
import Loading from "./Loading.vue";
import { customeApi } from "@/api";

const authStore = useAuthStore();
const userInput = reactive({
  name: "",
  email: "",
  password: "",
  password_confirmation: "",
});
const handleSubmit = () => {
  if (props.isRegister) {
    authStore.registerUser(userInput);
  } else {
    authStore.loginUser(userInput);
  }
};

const props = defineProps({
  name: {
    type: String,
    required: true,
  },
  isRegister: {
    type: Boolean,
    required: true,
    default: false,
  },
});
</script>
