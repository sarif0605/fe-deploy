<template>
  <div class="container">
    <div class="row">
      <div class="col-md-8 offset-md-2">
        <div class="card">
          <div class="card-header">Chat Room</div>
          <div class="card-body" style="height: 400px; overflow-y: scroll">
            <ul class="list-unstyled">
              <li v-for="message in messages" :key="message.id">
                <strong>{{ message.user.name }}:</strong> {{ message.message }}
              </li>
            </ul>
          </div>
          <div class="card-footer">
            <input
              type="text"
              class="form-control"
              v-model="newMessage"
              @keyup.enter="sendMessage"
            />
            <button class="btn btn-primary mt-2" @click="sendMessage">
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// import { customeApi } from "@/api";
// import { useAuthStore } from "@/stores/AuthStore";
// import { ref, onMounted } from "vue";
// import Echo from "laravel-echo";
// import Pusher from "pusher-js";

// const authStore = useAuthStore();
// const messages = ref([]);
// const newMessage = ref("");

// // Setup Echo
// window.Echo = new Echo({
//   broadcaster: "pusher",
//   key: "your-pusher-key",
//   wsHost: window.location.hostname,
//   wsPort: 6001,
//   forceTLS: false,
//   disableStats: true,
// });

// const fetchMessages = async () => {
//   const response = await customeApi.get("/messages");
//   messages.value = response.data.data;
// };

// const sendMessage = async () => {
//   if (newMessage.value === "") {
//     return;
//   }
//   await customeApi.post(
//     "/messages",
//     { message: newMessage.value },
//     {
//       headers: { Authorization: `Bearer ${authStore.userToken}` },
//     }
//   );
//   newMessage.value = "";
// };

// onMounted(() => {
//   fetchMessages();
//   Echo.join("chat")
//     .here((users) => {
//       console.log("Users online:", users);
//     })
//     .joining((user) => {
//       console.log(user.name + " joined.");
//     })
//     .leaving((user) => {
//       console.log(user.name + " left.");
//     })
//     .listen("MessageSent", (e) => {
//       messages.value.push(e.message); // Update messages directly
//     });
// });
</script>
