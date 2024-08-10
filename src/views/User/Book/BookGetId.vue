<template>
  <section class="mx-auto max-w-6xl px-8 rounded-xl md:py-20" v-if="movie">
    <div class="hero bg-base-200 min-h-screen">
      <div class="hero-content flex-col lg:flex-row">
        <img :src="movie.image" class="max-w-sm rounded-lg shadow-2xl" />
        <div>
          <h1 class="text-5xl font-bold">{{ movie.title }}</h1>
          <p>{{ movie.stock }}</p>
          <p class="py-6">{{ movie.summary }}</p>
        </div>
      </div>
    </div>

    <NameHeader :title="cast" />
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 mt-8">
      <Loading v-if="authStore.isLoading" />
      <div class="card bg-base-100 w-96 shadow-xl" v-else>
        <div
          class="card-body"
          v-for="cast in movie.list_borrows"
          :key="cast.id"
        >
          <div class="flex items-center space-x-4">
            <div class="avatar">
              <div class="w-24 rounded-full">
                <img
                  src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                />
              </div>
            </div>
            <div>
              <p>Tangga Pinjam : {{ cast.load_date }}</p>
              <p>Pengembalian : {{ cast.borrow_date }}</p>
              <!-- <p>{{ cast.bio }}</p> -->
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { customeApi } from "@/api";
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import { useAuthStore } from "@/stores/AuthStore";
import NameHeader from "@/components/NameHeader.vue";
import Loading from "@/components/Loading.vue";
const cast = "Borrow";
const authStore = useAuthStore();
const route = useRoute();

const movie = ref(null);
const reviews = ref("");

const detailMovie = async () => {
  authStore.isLoading = true;
  try {
    const { data } = await customeApi.get(`/book/${route.params.id}`);
    movie.value = data.data;
    console.log(data.data);
  } catch (error) {
    console.error("Failed to fetch review:", error);
  } finally {
    authStore.isLoading = false;
  }
};

onMounted(() => {
  detailMovie();
});
</script>
