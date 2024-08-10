<template>
  <div>
    <div class="modal" :class="{ 'modal-open': visible }">
      <div class="modal-box">
        <p class="py-4">{{ data ? "Update" : "Tambah" }} Category</p>
        <form @submit.prevent="handleSubmit">
          <div
            class="absolute top-0 left-0 w-full h-full flex justify-center items-center z-30"
            v-if="authStore.isLoading"
            style="background-color: rgba(0, 0, 0, 0.5)"
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
            Nama
            <input
              type="text"
              class="grow"
              placeholder="Nama Category"
              v-model="category.name"
            />
          </label>
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
import { reactive, watch, onMounted, watchEffect } from "vue";
import { customeApi } from "@/api";
import { useAuthStore } from "@/stores/AuthStore";
import { useToast } from "vue-toast-notification";
import Loading from "@/components/Loading.vue";
const $toast = useToast();
const authStore = useAuthStore();
const props = defineProps({
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

const category = reactive({
  id: null,
  name: "",
});

const clearInput = () => {
  category.id = null;
  category.name = "";
};

const fetchData = () => {
  if (props.data) {
    category.id = props.data.id;
    category.name = props.data.name;
  } else {
    clearInput();
  }
};

watch(
  () => props.visible,
  (newValue) => {
    if (newValue) {
      fetchData();
    } else {
      clearInput();
    }
  }
);

const handleSubmit = async () => {
  authStore.isErr = false;
  authStore.errMsg = {};
  authStore.isLoading = true;
  try {
    const url = category.id ? `/category/${category.id}` : "/category";
    const method = category.id ? "put" : "post";
    const response = await customeApi[method](
      url,
      { name: category.name },
      {
        headers: {
          Authorization: `Bearer ${authStore.userToken}`,
        },
      }
    );
    authStore.isLoading = false;
    $toast.success(
      category.id
        ? "Berhasil Ubah Data Kategori"
        : "Berhasil Tambah Data Kategori",
      {
        position: "top-right",
      }
    );
    if (response.data) {
      clearInput();
      emit("save");
      emit("closeModal");
    }
  } catch (error) {
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

onMounted(() => {
  clearInput();
  authStore.isErr = false;
});
</script>
