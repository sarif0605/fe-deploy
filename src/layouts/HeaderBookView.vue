<template>
  <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 p-4">
    <!-- Carousel Column -->
    <div class="lg:col-span-2 flex flex-col h-1/2">
      <div class="carousel w-full h-full">
        <div
          v-for="(book, index) in dataBook"
          :key="index"
          :id="'slide' + (index + 1)"
          class="carousel-item relative w-full"
        >
          <img :src="book.image" class="w-full" :alt="'Slide ' + (index + 1)" />
          <div
            class="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between"
          >
            <a v-if="index > 0" :href="'#slide' + index" class="btn btn-circle"
              >❮</a
            >
            <a
              v-if="index < dataBook.length - 1"
              :href="'#slide' + (index + 2)"
              class="btn btn-circle"
              >❯</a
            >
          </div>
        </div>
      </div>
    </div>

    <!-- Card Column -->
    <div class="lg:col-span-1 flex flex-col items-center">
      <div class="card bg-base-100 h-1/4 shadow-xl w-full lg:w-80">
        <figure>
          <img
            class="w-full object-cover"
            src="../assets/img/ilmu.jpg"
            alt="Shoes"
          />
        </figure>
      </div>
      <div class="card bg-base-100 h-1/4 shadow-xl w-full lg:w-80 mt-4">
        <figure>
          <img
            class="w-full object-cover"
            src="../assets/img/ilmu.webp"
            alt="Shoes"
          />
        </figure>
      </div>
    </div>
  </div>
</template>

<script setup>
import { customeApi } from "@/api";
import { ref, onMounted } from "vue";

const dataBook = ref([]);
const getBooks = async () => {
  try {
    const response = await customeApi.get("/book-news");
    dataBook.value = response.data.data;
  } catch (error) {
    console.log(error);
  }
};

onMounted(() => {
  getBooks();
});
</script>
