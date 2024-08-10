<template>
  <div class="min-h-screen bg-base-300 py-20 px-2 sm:p-8 md:p-12 lg:p-20">
    <div class="max-w-6xl mx-auto">
      <h1
        class="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-4 sm:mb-8"
      >
        Book
      </h1>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
        <div class="flex items-center justify-start">
          <button class="btn btn-active btn-primary" @click="openNewDialog()">
            <i class="pi pi-file-plus"></i>
          </button>
        </div>
        <div class="flex items-center justify-between sm:justify-end space-x-2">
          <button class="btn btn-active btn-primary" @click="generatePdf">
            <i class="pi pi-file-pdf"></i>
          </button>
          <input
            v-model="searchQuery"
            @input="searchBooks"
            type="text"
            placeholder="Search Books..."
            class="input input-bordered w-full sm:max-w-xs"
          />
        </div>
      </div>
      <div class="overflow-hidden mb-5">
        <div v-if="authStore.isLoading" class="flex justify-center py-4">
          <Loading />
        </div>
        <div class="overflow-x-auto" v-else>
          <table class="table min-w-full">
            <thead>
              <tr class="bg-base-content text-white border-b border-gray-300">
                <th>No</th>
                <th>Title</th>
                <th>Summary</th>
                <th>Stock</th>
                <th>Image</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr
                class="bg-base-100"
                v-for="(book, i) in dataBook"
                v-if="dataBook && dataBook.length > 0"
              >
                <th>{{ i + 1 }}</th>
                <th>{{ book.title }}</th>
                <th>{{ book.summary.substring(0, 50) }}...</th>
                <th>{{ book.stock }}</th>
                <th>
                  <img
                    class="w-10 h-10 object-cover"
                    :src="book.image"
                    alt="poster"
                  />
                </th>
                <th>
                  <button
                    class="btn btn-secondary btn-sm sm:btn-md"
                    @click="openEditDialog(book)"
                  >
                    <i class="pi pi-pencil"></i>
                  </button>
                  <button
                    class="btn btn-accent btn-sm sm:btn-md"
                    @click="openDeleteDialog(book)"
                  >
                    <i class="pi pi-trash"></i>
                  </button>
                </th>
              </tr>
              <tr v-else>
                <th colspan="6" class="text-center">Data belum tersedia</th>
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
  <BookDialogView
    @closeModal="closeModal"
    :data="selectedBook"
    @save="getAll"
    :category="category"
    @update:visible="showModal = $event"
    :visible="showModal"
  />

  <DeleteDialog
    :visible="deleteDialogVisible"
    :itemName="selectedBook?.title"
    @update:visible="deleteDialogVisible = $event"
    @confirmDelete="deleteBook"
  />
</template>

<script setup>
import { customeApi } from "@/api";
import DeleteDialog from "@/components/DeleteDialog.vue";
import { useAuthStore } from "@/stores/AuthStore";
import { ref, onMounted, watch } from "vue";
import BookDialogView from "./BookDialog.vue";
import { useToast } from "vue-toast-notification";
import Loading from "@/components/Loading.vue";
const $toast = useToast();
const authStore = useAuthStore();
const showModal = ref(false);
const category = ref([]);
const deleteDialogVisible = ref(false);
const dataBook = ref([]);
const selectedBook = ref(null);
const searchQuery = ref("");

const openModal = () => {
  showModal.value = true;
};

const openNewDialog = () => {
  selectedBook.value = null;
  openModal();
};

const openEditDialog = (book) => {
  selectedBook.value = book;
  openModal();
};

const closeModal = () => {
  showModal.value = false;
  selectedBook.value = null;
};

const generatePdf = async () => {
  try {
    const { data } = await customeApi.post(`/book-pdf`, null, {
      headers: {
        Authorization: `Bearer ${authStore.userToken}`,
        Accept: "application/pdf",
      },
      responseType: "blob",
    });
    const blob = new Blob([data], { type: "application/pdf" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    $toast.success("Berhasil Download PDF Report Buku", {
      position: "top-right",
    });
    link.download = "book-report.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error(error);
  }
};

const getCategory = async () => {
  try {
    const { data } = await customeApi.get("/category-all");
    category.value = data.data;
  } catch (error) {
    console.error("Failed to fetch genres:", error);
  }
};

const currentPage = ref(1);
const pagination = ref({});

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

const openDeleteDialog = (book) => {
  selectedBook.value = book;
  deleteDialogVisible.value = true;
};

const deleteBook = async () => {
  if (!selectedBook.value) return;
  try {
    await customeApi.delete(`/book/${selectedBook.value.id}`, {
      headers: {
        Authorization: `Bearer ${authStore.userToken}`,
      },
    });
    getAll();
    deleteDialogVisible.value = false;
  } catch (error) {
    console.log("Failed to delete book:", error);
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
  getCategory();
});
</script>
`
