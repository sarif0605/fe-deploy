<template>
  <section class="w-full">
    <HeaderHome />
  </section>
  <section class="mx-auto max-w-6xl px-8 rounded-xl mt-24">
    <AlamatView />
  </section>

  <!-- <section class="mx-auto max-w-6xl px-8 rounded-xl mt-24 bg-current">
    <ListGenre />
  </section> -->

  <section class="mx-auto max-w-6xl px-8 rounded-xl mt-24">
    <ListBookView />
  </section>
  <section class="mx-auto max-w-6xl px-8 rounded-xl mt-24">
    <BestBooksView />
  </section>
  <section class="mx-auto max-w-6xl px-8 rounded-xl mt-24">
    <BooksZeroView />
  </section>
</template>

<script setup>
import AlamatView from "@/layouts/AlamatView.vue";
import HeaderHome from "@/layouts/HeaderHome.vue";
import ListBookView from "@/layouts/ListBookView.vue";
import BestBooksView from "@/layouts/BooksNewView.vue";
import BooksZeroView from "@/layouts/BooksZeroView.vue";
import ListGenre from "@/layouts/ListGenre.vue";
</script>
