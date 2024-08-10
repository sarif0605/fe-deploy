<template>
  <div class="mx-auto max-w-6xl px-8 rounded-xl py-20 md:py-24">
    <NameHeader title="History Peminjaman" />
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-8">
      <Loading v-if="authStore.isLoading" />
      <div
        v-else
        class="card bg-base-100 image-full shadow-xl"
        v-for="borrow in dataBorrow"
        :key="borrow.id"
      >
        <figure>
          <img
            class="w-full object-cover"
            :src="borrow.book.image"
            alt="poster"
          />
        </figure>
        <div class="card-body">
          <h2 class="card-title">{{ borrow.book.title }}</h2>
          <p>{{ borrow.book.stock }}</p>
          <p>{{ borrow.book.summary }}</p>
          <p>{{ borrow.load_date }}</p>
          <p>{{ borrow.borrow_date }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { customeApi } from "@/api";
import { ref, onMounted, watch } from "vue";
import NameHeader from "@/components/NameHeader.vue";
import { useAuthStore } from "@/stores/AuthStore";
import Loading from "@/components/Loading.vue";
const dataBorrow = ref([]);
const authStore = useAuthStore();
const getAll = async () => {
  authStore.isLoading = true;
  try {
    const { data } = await customeApi.get(`/borrow-user`, {
      headers: {
        Authorization: `Bearer ${authStore.userToken}`,
      },
    });
    dataBorrow.value = data.data;
    console.log(data.data);
  } catch (error) {
    console.error("Failed to fetch books:", error);
  } finally {
    authStore.isLoading = false;
  }
};

onMounted(() => {
  getAll();
});
</script>
`
