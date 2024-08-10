<template>
  <div class="min-h-screen bg-base1 py-20 px-2 sm:p-8 md:p-12 lg:p-20">
    <div class="max-w-6xl mx-auto">
      <h1
        class="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-4 sm:mb-8"
      >
        Borrow
      </h1>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
        <div class="flex items-center justify-start">
          <button class="btn btn-active btn-primary" @click="generatePdf">
            <i class="pi pi-file-pdf"></i>
          </button>
        </div>
      </div>
      <div class="overflow-hidden mb-5">
        <div v-if="authStore.isLoading" class="flex justify-center py-4">
          <Loading />
        </div>
        <div class="overflow-x-auto" v-else>
          <table class="table min-w-full">
            <thead>
              <tr class="bg-base-content text-white border-b border-base-300">
                <th>No</th>
                <th>Load Date</th>
                <th>Borrow Date</th>
                <th>User</th>
                <th>Book</th>
              </tr>
            </thead>
            <tbody>
              <tr
                class="bg-base-100"
                v-for="(borrow, i) in dataBorrow"
                :key="borrow.id"
                v-if="dataBorrow && dataBorrow.length > 0"
              >
                <td>{{ (currentPage - 1) * perPage + i + 1 }}</td>
                <td>{{ borrow.load_date }}</td>
                <td>{{ borrow.borrow_date }}</td>
                <td>{{ borrow.user.name }}</td>
                <td>{{ borrow.book.title }}</td>
              </tr>
              <tr v-else>
                <td colspan="5" class="text-center">Data belum tersedia</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div class="flex justify-center mb-5 space-x-2">
        <button
          class="btn btn-sm sm:btn-md"
          @click="previousPage"
          :disabled="!pagination.prev_page_url"
        >
          «
        </button>
        <button class="btn btn-sm sm:btn-md">{{ currentPage }}</button>
        <button
          class="btn btn-sm sm:btn-md"
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
import { ref, onMounted } from "vue";
import { customeApi } from "@/api";
import { useAuthStore } from "@/stores/AuthStore";
import Loading from "@/components/Loading.vue";
const authStore = useAuthStore();
const dataBorrow = ref([]);
const currentPage = ref(1);
const perPage = ref(6); // Ensure this matches the per_page value from the API
const pagination = ref({});

const generatePdf = async () => {
  try {
    const { data } = await customeApi.post(`/borrow-pdf`, null, {
      headers: {
        Authorization: `Bearer ${authStore.userToken}`,
        Accept: "application/pdf",
      },
      responseType: "blob", // Ini penting untuk menangani file binary seperti PDF
    });

    // Membuat Blob dari data dan mempersiapkan untuk diunduh
    const blob = new Blob([data], { type: "application/pdf" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "borrow-report.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error(error);
  }
};

const getAll = async (page = 1) => {
  authStore.isLoading = true;
  try {
    const { data } = await customeApi.get(`/borrow?page=${page}`, {
      headers: {
        Authorization: `Bearer ${authStore.userToken}`,
      },
    });
    dataBorrow.value = data.data;
    pagination.value = data.meta;
    currentPage.value = data.meta.current_page;
  } catch (error) {
    console.error(error);
  } finally {
    authStore.isLoading = false;
  }
};

const previousPage = () => {
  if (pagination.value.prev_page_url) {
    getAll(currentPage.value - 1);
  }
};

const nextPage = () => {
  if (pagination.value.next_page_url) {
    getAll(currentPage.value + 1);
  }
};

onMounted(() => {
  getAll();
});
</script>
