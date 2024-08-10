<template>
  <section class="mx-auto max-w-6xl px-8 rounded-xl py-20 md:py-24">
    <NameHeader class="my-5" title="Waktu Peminjaman" />
    <div
      class="mx-auto max-w-6xl px-8 py-24 rounded-xl bg-primary text-base-300"
    >
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div class="flex flex-col items-center">
          <div class="w-48 h-48 mb-4 rounded overflow-hidden">
            <img
              :src="review.image"
              alt="Avatar"
              class="object-cover w-full h-full"
            />
          </div>
          <h2 class="text-2xl font-semibold mb-2">{{ review.title }}</h2>
          <p class="text-lg mb-2">Stock: {{ review.stock }}</p>
          <p class="mb-4">{{ review.summary }}</p>
        </div>

        <!-- Form Column -->
        <div class="flex flex-col items-center">
          <form class="w-full max-w-sm" @submit.prevent="submitReview">
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
                    <li v-for="(msg, index) in errors" :key="index">
                      {{ msg }}
                    </li>
                  </ul>
                </li>
              </ul>
            </div>
            <label class="input input-bordered flex items-center gap-2 mb-4">
              <input
                type="date"
                v-model="load"
                class="grow text-primary"
                placeholder="Load Date"
                required
              />
            </label>
            <label class="input input-bordered flex items-center gap-2 mb-4">
              <input
                type="date"
                v-model="borrow"
                class="grow text-primary"
                placeholder="Borrow Date"
                required
              />
            </label>
            <button type="submit" class="btn btn-base-100 mt-4">Submit</button>
          </form>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { customeApi } from "@/api";
import { useAuthStore } from "@/stores/AuthStore";
import NameHeader from "@/components/NameHeader.vue";
import { useToast } from "vue-toast-notification";
import Loading from "@/components/Loading.vue";
const $toast = useToast();
const authStore = useAuthStore();
const router = useRouter();
const route = useRoute();
const review = ref("");
const load = ref("");
const borrow = ref("");

const getReviewById = async () => {
  try {
    const { data } = await customeApi.get(`/book/${route.params.id}`);
    review.value = data.data;
  } catch (error) {
    console.error("Failed to fetch review:", error);
  }
};

const submitReview = async () => {
  authStore.isLoading = true;
  try {
    await customeApi.post(
      `/borrow`,
      {
        book_id: route.params.id,
        load_date: load.value,
        borrow_date: borrow.value,
      },
      {
        headers: {
          Authorization: `Bearer ${authStore.userToken}`,
        },
      }
    );
    authStore.isLoading = false;
    $toast.success("Berhasil Meminjam Buku", {
      position: "top-right",
    });
    router.push({ name: "HistoryBorrow" });
  } catch (error) {
    authStore.isLoading = false;
    authStore.isErr = true;
    if (error.response && error.response.data.errors) {
      authStore.errMsg = error.response.data.errors;
    } else {
      authStore.errMsg = { general: [error.response.data.message] };
    }
    console.error("Failed to submit review:", error);
  }
};

onMounted(() => {
  getReviewById();
});
</script>

<!-- <template>
  <div class="mx-auto max-w-6xl px-8 rounded-xl py-24">
    <div class="flex flex-col items-center">
      <div class="w-48 h-48 mb-4 rounded overflow-hidden">
        <img
          :src="review.image"
          alt="Avatar"
          class="object-cover w-full h-full"
        />
      </div>
      <h2 class="text-2xl font-semibold mb-2">{{ review.title }}</h2>
      <p class="text-lg text-gray-600 mb-2">Stock: {{ review.stock }}</p>
      <p class="text-gray-700 mb-4"></p>
      <form class="w-full max-w-sm" @submit.prevent="submitReview">
        <label class="input input-bordered flex items-center gap-2 mb-4">
          <input
            type="date"
            v-model="load"
            class="grow"
            placeholder="Load Date"
            required
          />
        </label>
        <label class="input input-bordered flex items-center gap-2 mb-4">
          <input
            type="date"
            v-model="borrow"
            class="grow"
            placeholder="Borrow Date"
            required
          />
        </label>
        <button type="submit" class="btn btn-primary mt-4">Submit</button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { customeApi } from "@/api";
import { useAuthStore } from "@/stores/AuthStore";

const authStore = useAuthStore();
const router = useRouter();
const route = useRoute();
const review = ref("");
const load = ref("");
const borrow = ref(3);

const getReviewById = async () => {
  try {
    const { data } = await customeApi.get(`/book/${route.params.id}`);
    review.value = data.data;
    console.log(data);
  } catch (error) {
    console.error("Failed to fetch review:", error);
  }
};

const submitReview = async () => {
  try {
    await customeApi.post(
      `/borrow`,
      {
        book_id: route.params.id,
        load_date: load.value,
        borrow_date: borrow.value,
      },
      {
        headers: {
          Authorization: `Bearer ${authStore.userToken}`,
        },
      }
    );
    router.push({ name: "Home" });
  } catch (error) {
    console.error("Failed to submit review:", error);
  }
};

onMounted(() => {
  getReviewById();
});
</script> -->
