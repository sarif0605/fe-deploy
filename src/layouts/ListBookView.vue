<template>
  <NameHeader title="Daftar Buku" />
  <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 py-4">
    <!-- Kolom Kartu -->
    <div class="lg:col-span-1 flex flex-col">
      <div class="card bg-base-100 shadow-xl h-full">
        <div class="card-body">
          <h2 class="card-title">Pilih Kategori Buku</h2>
          <p>Temukan buku favorit Anda dengan memilih kategori di bawah ini:</p>
          <p class="dropdown mb-20">
            <div tabindex="0" role="button" class="btn m-1">Pilih Kategori</div>
            <ul
              tabindex="0"
              class="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow"
            >
              <li v-for="category in listCategory" :key="category.id">
                <a @click="selectCategory(category)">{{ category.name }}</a>
              </li>
            </ul>
          </p>
          <div class="card-actions justify-end"></div>
        </div>
      </div>
    </div>

    <!-- Kolom Carousel -->
    <div class="lg:col-span-2 flex">
      <div class="carousel carousel-center bg-primary rounded-box w-full space-x-4 p-4">
  <Loading v-if="isLoading" />
  
  <div v-if="!isLoading && selectedCategoryBooks.length === 0" class="carousel-item">
    <div class="card bg-base-100 w-80 h-96 shadow-xl flex items-center justify-center transition duration-300 ease-in-out transform hover:scale-105 hover:shadow-2xl">
      <p class="text-center animate-pulse">Tidak ada buku dalam kategori ini.</p>
    </div>
  </div>
  
  <div v-else v-for="book in selectedCategoryBooks" :key="book.id" class="carousel-item">
    <div class="card bg-base-100 w-80 h-96 shadow-xl transition duration-300 ease-in-out transform hover:scale-105 hover:shadow-2xl">
      <figure class="relative mx-2 overflow-hidden">
        <img class="z-10 mx-2 transition duration-300 ease-in-out transform hover:scale-110" :src="book.image" :alt="book.title" />
      </figure>
      <div class="card-body absolute bottom-9 bg-primary z-20 mx-4 shadow-lg text-base-100 transition duration-300 ease-in-out hover:bg-primary-focus">
        <h2 class="card-title transition duration-300 ease-in-out hover:text-secondary">{{ book.title }}</h2>
        <p class="transition duration-300 ease-in-out hover:text-gray-300">{{ book.summary.substring(0, 30) }}...</p>
        <div class="card-actions justify-end">
          <RouterLink 
            :to="{ name: 'BookGetId', params: { id: book.id } }"
            class="btn btn-accent transition duration-300 ease-in-out transform hover:scale-110 hover:bg-secondary"
          >
            Detail
          </RouterLink>
          <RouterLink 
            v-if="book.stock > 0"
            :to="{ name: 'BorrowBookUser', params: { id: book.id } }"
            class="btn btn-secondary transition duration-300 ease-in-out transform hover:scale-110 hover:bg-secondary"
          >
            Pinjam
          </RouterLink>
        </div>
      </div>
    </div>
  </div>
</div>
    </div>
  </div>
</template>

<script setup>
import { customeApi } from "@/api";
import NameHeader from "@/components/NameHeader.vue";
import Loading from "@/components/Loading.vue"; // Import the loading component
import { onMounted, ref } from "vue";

const listCategory = ref([]);
const selectedCategoryBooks = ref([]);
const isLoading = ref(false); // Track the loading state

const fetchCategories = async () => {
  isLoading.value = true;
  try {
    const response = await customeApi.get("/category-all");
    listCategory.value = response.data.data;
  } catch (error) {
    console.log(error);
  } finally {
    isLoading.value = false;
  }
};

const selectCategory = async (category) => {
  isLoading.value = true;
  try {
    const response = await customeApi.get(`/category/${category.id}`);
    selectedCategoryBooks.value = response.data.data.list_books;
  } catch (error) {
    console.log(error);
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  fetchCategories();
});
</script>