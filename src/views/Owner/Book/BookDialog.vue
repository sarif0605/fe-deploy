<template>
  <div>
    <div class="modal" :class="{ 'modal-open': visible }">
      <div class="modal-box relative z-20">
        <p class="py-4">{{ data ? "Update" : "Tambah" }} Book</p>
        <form @submit.prevent="handleSubmit" enctype="multipart/form-data">
          <div
            v-if="authStore.isLoading"
            class="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 z-10"
          >
            <Loading />
          </div>
          <div role="alert" class="alert alert-error" v-if="authStore.isErr">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6 shrink-0 stroke-current"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <ul>
              <li
                v-for="(msg, index) in authStore.errMsg.general"
                :key="'general-' + index"
              >
                {{ msg }}
              </li>
              <li
                v-for="(errors, field) in authStore.errMsg"
                v-if="field !== 'general'"
                :key="field"
              >
                <ul>
                  <li v-for="(msg, index) in errors" :key="index">{{ msg }}</li>
                </ul>
              </li>
            </ul>
          </div>
          <label class="input input-bordered flex items-center gap-2">
            <input
              type="text"
              class="grow"
              placeholder="Title"
              v-model="book.title"
            />
          </label>
          <label class="flex flex-col gap-2 mt-2 w-full">
            <textarea
              class="textarea textarea-bordered w-full"
              placeholder="Summary"
              v-model="book.summary"
            ></textarea>
          </label>
          <label class="input input-bordered flex items-center gap-2 mt-2">
            <input
              type="number"
              class="grow"
              placeholder="Stock"
              v-model="book.stock"
            />
          </label>
          <label class="input input-bordered flex items-center mt-2">
            <select
              class="select select-primary w-full"
              v-if="props.category"
              v-model="book.category_id"
            >
              <option disabled value="">Pilih</option>
              <option
                v-for="category in props.category"
                :key="category.id"
                :value="category.id"
              >
                {{ category.name }}
              </option>
            </select>
          </label>
          <label class="input input-bordered flex items-center gap-2 mt-2">
            <input
              class="grow"
              id="poster"
              type="file"
              accept="image/*"
              @change="selectImage"
            />
          </label>
          <div class="avatar mt-2" v-if="book.previewImage">
            <div class="w-24 rounded">
              <img :src="book.previewImage" />
            </div>
          </div>
          <div class="modal-action">
            <button class="btn btn-primary" type="submit">Kirim</button>
            <button class="btn btn-base-300" type="button" @click="closeDialog">
              Close
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, watch } from "vue";
import { customeApi } from "@/api";
import { useAuthStore } from "@/stores/AuthStore";
import Loading from "@/components/Loading.vue";
import { useToast } from "vue-toast-notification";
const $toast = useToast();
const authStore = useAuthStore();
const props = defineProps({
  category: {
    type: Array,
    required: true,
  },
  data: {
    type: Object,
    default: null,
  },
  visible: Boolean,
});
const emit = defineEmits(["closeModal", "save", "update:visible"]);
const closeDialog = () => {
  emit("update:visible", false);
};
const book = reactive({
  id: null,
  summary: "",
  title: "",
  stock: null,
  currentImage: null,
  previewImage: null,
  category_id: "",
});

const clearInput = () => {
  book.id = null;
  book.summary = "";
  book.title = "";
  book.stock = null;
  book.currentImage = null;
  book.previewImage = null;
  book.category_id = "";
};

watch(
  () => props.data,
  (newValue) => {
    if (newValue) {
      book.id = newValue.id;
      book.title = newValue.title;
      book.summary = newValue.summary;
      book.stock = newValue.stock;
      book.category_id = newValue.category_id;
      book.previewImage = newValue.image;
    } else {
      clearInput();
    }
  },
  { immediate: true }
);

const handleSubmit = async () => {
  authStore.isLoading = true;
  if (!book.category_id) {
    alert("Please select a genre.");
    return;
  }
  const isFileUpload = book.currentImage;

  let formData;
  let headers;

  if (isFileUpload) {
    formData = new FormData();
    formData.append("title", book.title);
    formData.append("summary", book.summary);
    formData.append("stock", book.stock);
    formData.append("category_id", book.category_id);
    if (book.currentImage) {
      formData.append("image", book.currentImage);
    } else if (book.previewImage) {
      formData.append("image", book.previewImage);
    }
  } else {
    formData = JSON.stringify({
      title: book.title,
      summary: book.summary,
      stock: book.stock,
      category_id: book.category_id,
    });
  }
  headers = {
    Authorization: `Bearer ${authStore.userToken}`,
    "Content-Type": isFileUpload ? "multipart/form-data" : "application/json",
  };
  console.log(authStore.userData, authStore.userToken);

  try {
    const url = book.id ? `/book/${book.id}` : "/book";
    const method = book.id ? "put" : "post";
    const response = await customeApi[method](url, formData, {
      headers: headers,
    });
    console.log(method, url, headers);
    if (response.data) {
      clearInput();
      emit("save");
      emit("closeModal");
    }
    authStore.isLoading = false;
    $toast.success(
      book.id ? "Berhasil Ubah Data Buku" : "Berhasil Tambah Data Buku",
      {
        position: "top-right",
      }
    );
  } catch (error) {
    console.log(error);
    authStore.isLoading = false;
    authStore.isErr = true;
    if (error.response && error.response.data.errors) {
      authStore.errMsg = error.response.data.errors;
    } else {
      authStore.errMsg = { general: [error.response.data.message] };
    }
    console.log(error);
  }
};

const selectImage = (event) => {
  const file = event.target.files[0];
  if (file) {
    book.currentImage = file;
    book.previewImage = URL.createObjectURL(file);
  }
};
</script>
