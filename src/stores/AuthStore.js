import { customeApi } from "@/api";
import { defineStore } from "pinia";
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useToast } from "vue-toast-notification";

export const useAuthStore = defineStore("auth", () => {
  const router = useRouter();
  const isLoading = ref(false);
  const isErr = ref(false);
  const $toast = useToast();
  const errMsg = ref([]);
  const userToken = ref(
    localStorage.getItem("token")
      ? JSON.parse(localStorage.getItem("token"))
      : null
  );
  const userData = ref(
    localStorage.getItem("user")
      ? JSON.parse(localStorage.getItem("user"))
      : null
  );

  const loginUser = async (inputData) => {
    isLoading.value = true;
    try {
      const { email, password } = inputData;
      const { data } = await customeApi.post("/auth/login", {
        email,
        password,
      });
      const { token, user } = data;
      userToken.value = token;
      userData.value = user;
      localStorage.setItem("token", JSON.stringify(token));
      localStorage.setItem("user", JSON.stringify(user));
      isLoading.value = false;
      console.log(user.role.name);
      $toast.success("Berhasil Melakukan Login!", {
        position: "top-right",
      });
      if (user.role.name == "owner") {
        router.push({ name: "Dashboard" });
      } else {
        router.push({ name: "Home" });
      }
    } catch (error) {
      isLoading.value = false;
      isErr.value = true;
      if (error.response && error.response.data.errors) {
        errMsg.value = error.response.data.errors;
      } else {
        errMsg.value = { general: [error.response.data.message] };
      }
    }
  };

  const registerUser = async (inputData) => {
    isLoading.value = true;
    try {
      const { name, email, password, password_confirmation } = inputData;
      const { data } = await customeApi.post("/auth/register", {
        name,
        email,
        password,
        password_confirmation,
      });
      const { token, user } = data;
      userData.value = user;
      userToken.value = token;
      localStorage.setItem("token", JSON.stringify(token));
      localStorage.setItem("user", JSON.stringify(user));
      isLoading.value = false;
      $toast.success("Berhasil Melakukan Registrasi!", {
        position: "top-right",
      });
      router.push({ name: "Login" });
    } catch (error) {
      isLoading.value = false;
      isErr.value = true;
      if (error.response && error.response.data.errors) {
        errMsg.value = error.response.data.errors;
      } else {
        errMsg.value = { general: [error.response.data.message] };
      }
    }
  };

  const getUser = async () => {
    const { data } = await customeApi.get("/get-user", {
      headers: {
        Authorization: `Bearer ${userToken.value}`,
      },
    });
    localStorage.setItem("user", JSON.stringify(data.data));
    userData.value = data.data;
    return data.data;
  };

  const getProfile = async () => {
    const { data } = await customeApi.get("/get-profile", {
      headers: {
        Authorization: `Bearer ${userToken.value}`,
      },
    });
    return data.data;
  };

  const updateUser = async (name) => {
    try {
      await customeApi.put("/update-user", name, {
        headers: { Authorization: `Bearer ${userToken.value}` },
      });
    } catch (error) {
      isErr.value = true;
      if (error.response && error.response.data.errors) {
        errMsg.value = error.response.data.errors;
      } else {
        errMsg.value = { general: [error.response.data.message] };
      }
      console.log(error);
    }
  };

  const updateProfile = async (inputData) => {
    try {
      const { age, bio } = inputData;
      await customeApi.post(
        "/update-profile",
        { age, bio },
        {
          headers: { Authorization: `Bearer ${userToken.value}` },
        }
      );
    } catch (error) {
      isErr.value = true;
      if (error.response && error.response.data.errors) {
        errMsg.value = error.response.data.errors;
      } else {
        errMsg.value = { general: [error.response.data.message] };
      }
    }
  };

  const logoutUser = async () => {
    await customeApi.post("/auth/logout", null, {
      headers: {
        Authorization: `Bearer ${userToken.value}`,
      },
    });
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    userToken.value = null;
    userData.value = null;
    $toast.success("Berhasil Keluar Dari Sistem!", {
      position: "top-right",
    });
    console.log(userToken.value);
    router.push({ name: "Home" });
  };

  const loginWithGoogle = () => {
    window.location.href = "http://localhost:8000/api/v1/auth/google";
  };

  const handleGoogleCallback = async () => {
    isLoading.value = true;
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");
    const userStr = urlParams.get("user");

    try {
      console.log("Token:", token);
      console.log("User string:", userStr);

      userToken.value = token;
      if (userStr) {
        const decodedUserStr = decodeURIComponent(userStr);
        userData.value = JSON.parse(decodedUserStr);
        localStorage.setItem("token", JSON.stringify(token));
        localStorage.setItem("user", JSON.stringify(userData.value));
        if (userData.value && userData.value.role && userData.value.role.name) {
          if (userData.value.role.name === "owner") {
            router.push({ name: "Dashboard" });
          } else {
            router.push({ name: "Home" });
          }
          $toast.success("Berhasil Melakukan Login!", {
            position: "top-right",
          });
        } else {
          throw new Error("Invalid user data structure");
        }
      } else {
        throw new Error("User data is missing");
      }
    } catch (error) {
      isLoading.value = false;
      isErr.value = true;
      if (error.response && error.response.data && error.response.data.errors) {
        errMsg.value = error.response.data.errors;
      } else {
        errMsg.value = { general: [error.message] };
      }
      console.error("Error:", error);
    }
  };

  return {
    userToken,
    userData,
    isErr,
    errMsg,
    isLoading,
    getProfile,
    getUser,
    loginUser,
    logoutUser,
    registerUser,
    updateProfile,
    updateUser,
    loginWithGoogle,
    handleGoogleCallback,
  };
});
