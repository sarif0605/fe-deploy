<template>
  <section class="mx-auto max-w-6xl px-8 rounded-xl md:py-20" v-if="category">
    <div class="border-b border-primary pb-2">
      <h1 class="text-3xl text-primary font-bold">{{ category.name }}</h1>
    </div>
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 mt-8">
      <div
        class="card card-side bg-base-100 shadow-xl"
        v-for="book in category.list_books"
        :key="book.id"
        v-if="category.list_books.length > 0"
      >
        <figure>
          <img class="h-full object-cover" :src="book.image" alt="Books" />
        </figure>
        <div class="card-body">
          <h2 class="card-title">{{ book.title }}</h2>
          <p>{{ book.stock }}</p>
          <p>{{ book.summary.substring(1, 100) }} ...</p>
          <div class="card-actions justify-end">
            <RouterLink
              :to="{ name: 'BookGetId', params: { id: book.id } }"
              class="btn btn-primary"
              >Detail</RouterLink
            >
            <RouterLink
              v-if="book.stock > 0 && authStore.userToken"
              :to="{ name: 'BorrowBookUser', params: { id: book.id } }"
              class="btn btn-secondary transition duration-300 ease-in-out transform hover:scale-110 hover:bg-primary-focus"
            >
              Pinjam
            </RouterLink>
          </div>
        </div>
      </div>
      <div class="card card-side bg-base-100 shadow-xl" v-else>
        <div class="card-body">
          <h2 class="card-title">Tidak Ada Data Buku</h2>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { customeApi } from "@/api";
import { onMounted, ref } from "vue";
import { RouterLink, useRoute } from "vue-router";

const route = useRoute();
const category = ref(null);

const detailGenre = async () => {
  const { data } = await customeApi.get(`/category/${route.params.id}`);
  category.value = data.data;
  console.log(category.value);
};

onMounted(() => {
  detailGenre();
});
</script>
