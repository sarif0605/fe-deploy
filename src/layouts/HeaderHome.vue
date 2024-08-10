<template>
  <div class="hero min-h-screen relative">
    <video
      autoplay
      muted
      loop
      class="absolute inset-0 w-full h-full object-cover"
    >
      <source :src="video" type="video/mp4" />
      Your browser does not support the video tag.
    </video>
    <div class="hero-overlay bg-opacity-60 absolute inset-0"></div>
    <div
      class="hero-content flex flex-col justify-center items-center text-white text-center rounded-tr-2xl rounded-bl-2xl p-8 sm:p-12 md:p-16 lg:p-24 m-4 sm:m-8 md:m-16 lg:m-24 w-full md:w-3/4 lg:w-1/2 min-h-96 relative z-10"
    >
      <div class="max-w-md">
        <h1 class="mb-5 text-3xl sm:text-4xl lg:text-5xl font-bold">
          Selamat Datang di Perpustakaan Kami
        </h1>
        <p class="mb-5">
          Masuki dunia pengetahuan dan imajinasi dengan koleksi buku kami yang
          lengkap. Dari karya klasik hingga buku terbaru, nikmati keajaiban
          membaca yang tak tertandingi. Temukan berbagai genre dan topik yang
          akan membawa Anda pada petualangan literasi yang mendalam.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import video from "@/assets/img/video.mp4";
</script>

<!-- <template>
  <div class="hero min-h-screen" :style="{ backgroundImage: `url(${image})` }">
    <div class="hero-overlay bg-opacity-60"></div>
    <div
      class="hero-content flex flex-col justify-center items-center text-primary bg-base-300 text-center rounded-tr-2xl rounded-bl-2xl p-8 sm:p-12 md:p-16 lg:p-24 m-4 sm:m-8 md:m-16 lg:m-24 w-full md:w-3/4 lg:w-1/2 min-h-96"
    >
      <div class="max-w-md">
        <h1 class="mb-5 text-3xl sm:text-4xl lg:text-5xl font-bold">
          Selamat Datang di Perpustakaan Kami
        </h1>
        <p class="mb-5">
          Masuki dunia pengetahuan dan imajinasi dengan koleksi buku kami yang
          lengkap. Dari karya klasik hingga buku terbaru, nikmati keajaiban
          membaca yang tak tertandingi. Temukan berbagai genre dan topik yang
          akan membawa Anda pada petualangan literasi yang mendalam.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import image from "@/assets/img/video.mp4";
</script> -->
