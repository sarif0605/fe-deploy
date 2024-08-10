<template>
  <NameHeader title="Buku Terbaru" />
  <div
    class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 py-4"
  >
    <div
      class="flex justify-center items-center"
      v-if="authStore.isLoading"
      style="background-color: rgba(0, 0, 0, 0.5)"
    >
      <Loading />
    </div>

    <div v-if="!authStore.isLoading && dataBook.length === 0">
      <div
        class="card bg-base-100 w-80 h-96 shadow-xl flex items-center justify-center transition duration-300 ease-in-out transform hover:scale-105 hover:shadow-2xl"
      >
        <p class="text-center animate-pulse">Tidak Ada Buku pada.</p>
      </div>
    </div>
    <div
      class="card bg-base-100 shadow-xl transform transition duration-500 hover:scale-105 hover:shadow-2xl"
      v-for="book in dataBook"
      :key="book.id"
      v-else
    >
      <figure class="overflow-hidden">
        <img
          class="w-full h-48 object-cover transition duration-500 ease-in-out transform hover:scale-110"
          :src="book.image"
          alt="Book Image"
        />
      </figure>
      <div class="card-body">
        <h2
          class="card-title transition duration-300 ease-in-out hover:text-primary"
        >
          {{ book.title }}
        </h2>
        <p class="transition duration-300 ease-in-out hover:text-secondary">
          Stock: {{ book.stock }}
        </p>
        <p class="transition duration-300 ease-in-out hover:text-gray-600">
          {{ book.summary.substring(0, 20) }}...
        </p>
        <div class="card-actions justify-end">
          <RouterLink
            :to="{ name: 'BookGetId', params: { id: book.id } }"
            class="btn btn-accent transition duration-300 ease-in-out transform hover:scale-110 hover:bg-opacity-90"
          >
            Detail
          </RouterLink>
          <RouterLink
            v-if="book.stock > 0"
            :to="{ name: 'BorrowBookUser', params: { id: book.id } }"
            class="btn btn-secondary transition duration-300 ease-in-out transform hover:scale-110 hover:bg-opacity-90"
          >
            Pinjam
          </RouterLink>
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
    const response = await customeApi.get("/book-news");
    dataBook.value = response.data.data;
  } catch (error) {
    console.log(error);
  } finally {
    authStore.isLoading = false;
  }
};

onMounted(() => {
  getBooks();
});
</script>
