<template>
  <div class="p-6 overflow-hidden bg-base-300">
    <h1 class="text-2xl font-bold mb-6">Dashboard Owner</h1>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <InfoCard
        class="bg-base-300"
        title="Total Buku"
        icon="pi pi-book"
        :count="bookInfo.totalBooks"
      />
      <InfoCard
        class="bg-secondary-content"
        title="Buku Dipinjam"
        icon="pi pi-bookmark-fill"
        :count="bookInfo.borrowedBooks"
      />
      <InfoCard
        class="bg-primary-content"
        title="Buku Tersedia"
        icon="pi pi-bookmark"
        :count="bookInfo.availableBooks"
      />
      <InfoCard
        class="bg-neutral-content"
        title="User"
        icon="pi pi-users"
        :count="bookInfo.reservedBooks"
      />
    </div>
    <div class="bg-white p-6 rounded-lg shadow-md h-1/2">
      <h2 class="text-xl font-bold mb-4">Statistik Peminjaman</h2>
      <Chart />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import InfoCard from "@/components/InfoCard.vue";
import Chart from "@/components/Chart.vue";
import { customeApi } from "@/api";

const bookInfo = ref({
  totalBooks: 0,
  borrowedBooks: 0,
  availableBooks: 0,
  reservedBooks: 0,
});

const fetchBookInfo = async () => {
  try {
    const response = await customeApi.get("/book-chard");
    bookInfo.value = response.data;
    console.log("Book info:", bookInfo.value);
  } catch (error) {
    console.error("Error fetching book info:", error);
  }
};

onMounted(() => {
  fetchBookInfo();
});
</script>
