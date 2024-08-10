<template>
  <NameHeader class="mb-8" title="Books Stok Kosong" />
  <div
    class="carousel carousel-center bg-primary rounded-box w-full space-x-4 p-4 items-center"
  >
    <Loading v-if="authStore.isLoading" />

    <div
      v-if="!authStore.isLoading && dataBook.length === 0"
      class="carousel-item"
    >
      <div
        class="card bg-base-100 w-80 h-96 shadow-xl flex items-center justify-center transition duration-300 ease-in-out transform hover:scale-105 hover:shadow-2xl"
      >
        <p class="text-center animate-pulse">Tidak Ada Buku pada.</p>
      </div>
    </div>

    <div v-else class="carousel-item" v-for="book in dataBook" :key="book.id">
      <div
        class="card bg-base-100 w-80 h-96 shadow-xl px-3 transition duration-300 ease-in-out transform hover:scale-105 hover:shadow-2xl"
      >
        <figure class="mx-2 overflow-hidden">
          <img
            class="z-10 mx-2 w-full transition duration-300 ease-in-out transform hover:scale-110"
            :src="book.image"
            alt="Shoes"
          />
        </figure>
        <div class="card-body mx-4 shadow-lg">
          <h2
            class="card-title transition duration-300 ease-in-out hover:text-primary"
          >
            {{ book.title }}
          </h2>
          <p class="transition duration-300 ease-in-out hover:text-secondary">
            Stock: {{ book.stock }}
          </p>
          <p class="transition duration-300 ease-in-out hover:text-gray-600">
            {{ book.summary.substring(0, 30) }}...
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { customeApi } from "@/api";
import Loading from "@/components/Loading.vue";
import NameHeader from "@/components/NameHeader.vue";
import { useAuthStore } from "@/stores/AuthStore";
import { onMounted, ref } from "vue";

const dataBook = ref([]);
const authStore = useAuthStore();

const getBooks = async () => {
  authStore.isLoading = true;
  try {
    const response = await customeApi.get("/book-zero");
    dataBook.value = response.data.data;
  } catch (error) {
    console.error("Failed to fetch books:", error);
  } finally {
    authStore.isLoading = false;
  }
};

onMounted(() => {
  getBooks();
});
</script>
