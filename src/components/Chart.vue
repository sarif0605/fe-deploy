<template>
  <div class="h-1/2">
    <canvas ref="chart"></canvas>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { Chart, registerables } from "chart.js";
import { customeApi } from "@/api";

// Register all necessary components
Chart.register(...registerables);

const chart = ref(null);

const fetchBorrowStats = async () => {
  try {
    const response = await customeApi.get("/book-chart");
    return response.data;
  } catch (error) {
    console.error("Error fetching borrow stats:", error);
    return [];
  }
};

const renderChart = async () => {
  const data = await fetchBorrowStats();
  const ctx = chart.value.getContext("2d");
  new Chart(ctx, {
    type: "bar",
    data: {
      labels: [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ],
      datasets: [
        {
          label: "Books Borrowed",
          data: Object.values(data),
          backgroundColor: "rgba(75, 192, 192, 0.2)",
          borderColor: "rgba(75, 192, 192, 1)",
          borderWidth: 1,
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });
};

onMounted(() => {
  renderChart();
});
</script>
