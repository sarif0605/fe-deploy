<template>
  <section class="mx-auto max-w-6xl px-8 rounded-xl py-20 md:py-24">
    <NameHeader title="Category All" />
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mt-8 gap-4">
      <Loading v-if="authStore.isLoading" />
      <div
        v-else
        class="card bg-base-100 w-full shadow-xl border-b-4 border-primary pt-5 hover:scale-105 hover:bg-primary-light transition-transform duration-300"
        v-for="(category, index) in dataCategory"
        :key="category.id"
      >
        <div class="card-body">
          <h2 class="card-title text-primary">{{ category.name }}</h2>
          <div class="card-actions justify-end">
            <RouterLink
              class="btn btn-primary"
              :to="{ name: 'CategoryGetIdUser', params: { id: category.id } }"
              >Detail</RouterLink
            >
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
  </section>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { customeApi } from "@/api";
import { useAuthStore } from "@/stores/AuthStore";
import { RouterLink } from "vue-router";
import NameHeader from "@/components/NameHeader.vue";
import Loading from "@/components/Loading.vue";
const authStore = useAuthStore();

const showModal = ref(false);
const deleteDialogVisible = ref(false);
const dataCategory = ref([]);
const selectedCategory = ref(null);
const currentPage = ref(1);
const pagination = ref({});

const getAll = async () => {
  authStore.isLoading = true;
  try {
    const { data } = await customeApi.get(
      `/category?page=${currentPage.value}`
    );
    dataCategory.value = data.data;
    pagination.value = data.pagination;
  } catch (error) {
    console.error(error);
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

onMounted(() => {
  getAll();
});
</script>
