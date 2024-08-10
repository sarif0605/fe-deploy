<template>
  <div class="mx-auto max-w-6xl px-8 rounded-xl py-20">
    <NameHeader title="Books" />
    <div class="flex mt-4 items-center justify-between">
      <input
        v-model="searchQuery"
        @input="searchBooks"
        type="text"
        class="input input-bordered w-full max-w-xs"
        placeholder="Search books..."
      />
    </div>
    <div
      class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 py-4"
    >
      <Loading v-if="authStore.isLoading" />
      <div
        v-else
        class="card bg-base-100 shadow-xl transform transition duration-300 ease-in-out hover:scale-105 hover:shadow-2xl"
        v-for="book in dataBook"
        :key="book.id"
      >
        <figure class="overflow-hidden">
          <img
            class="w-full h-48 object-cover transition duration-300 ease-in-out transform hover:scale-110"
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
              class="btn btn-accent transition duration-300 ease-in-out transform hover:scale-110 hover:bg-primary-focus"
            >
              Detail
            </RouterLink>
            <RouterLink
              v-if="book.stock > 0"
              :to="{ name: 'BorrowBookUser', params: { id: book.id } }"
              class="btn btn-secondary transition duration-300 ease-in-out transform hover:scale-110 hover:bg-primary-focus"
            >
              Pinjam
            </RouterLink>
          </div>
        </div>
      </div>
    </div>

    <div class="flex justify-center mt-10">
      <div class="btn-group">
        <button
          class="btn btn-outline"
          @click="previousPage"
          :disabled="!pagination.prev_page_url"
        >
          «
        </button>
        <button class="btn btn-outline">Page {{ currentPage }}</button>
        <button
          class="btn btn-outline"
          @click="nextPage"
          :disabled="!pagination.next_page_url"
        >
          »
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { customeApi } from "@/api";
import { ref, onMounted, watch } from "vue";
import NameHeader from "@/components/NameHeader.vue";
import HeaderBookView from "@/layouts/HeaderBookView.vue";
import { useAuthStore } from "@/stores/AuthStore";
import Loading from "@/components/Loading.vue";
const dataBook = ref([]);
const searchQuery = ref("");
const currentPage = ref(1);
const pagination = ref({});

const authStore = useAuthStore();

const getAll = async (page = 1, perPage = 10) => {
  authStore.isLoading = true;
  try {
    const searchParams = new URLSearchParams();
    searchParams.append("page", currentPage.value);
    if (searchQuery.value) searchParams.append("query", searchQuery.value);

    const { data } = await customeApi.get(
      `/search-book?${searchParams.toString()}`
    );
    dataBook.value = data.data;
    pagination.value = data.pagination;
  } catch (error) {
    console.error("Failed to fetch books:", error);
  } finally {
    authStore.isLoading = false;
  }
};

const previousPage = () => {
  if (pagination.value.prev_page_url) {
    currentPage.value -= 1;
    getAll();
  }
};

const nextPage = () => {
  if (pagination.value.next_page_url) {
    currentPage.value += 1;
    getAll();
  }
};

const searchBooks = () => {
  if (!searchQuery.value) {
    getAll();
  } else {
    currentPage.value = 1;
    getAll();
  }
};

watch(searchQuery, () => {
  searchBooks();
});

onMounted(() => {
  getAll();
});
</script>
`
