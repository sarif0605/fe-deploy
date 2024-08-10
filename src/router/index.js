import NotFound from "@/components/NotFound.vue";
import OwnerLayout from "@/components/Owner/OwnerLayout.vue";
import PublicLayouts from "@/layouts/PublicLayouts.vue";
import { useAuthStore } from "@/stores/AuthStore";
import LoginView from "@/views/Auth/LoginView.vue";
import RegisterView from "@/views/Auth/RegisterView.vue";
import ChatView from "@/views/ChatView.vue";
import HomeView from "@/views/HomeView.vue";
import BookViewOwner from "@/views/Owner/Book/BookView.vue";
import BorrowView from "@/views/Owner/Borrow/BorrowView.vue";
import CategoryViewOwner from "@/views/Owner/CategoryOwner/CategoryViewOwner.vue";
import DashboardView from "@/views/Owner/DashboardView.vue";
import ProfileOwner from "@/views/Owner/Profile/ProfileOwner.vue";
import ProfileUpdateOwner from "@/views/Owner/Profile/ProfileUpdateOwner.vue";
import BookGetId from "@/views/User/Book/BookGetId.vue";
import BookView from "@/views/User/Book/BookView.vue";
import BorrowUser from "@/views/User/Borrows/BorrowUser.vue";
import HistoryBorrow from "@/views/User/Borrows/HistoryBorrow.vue";
import CategoryGetId from "@/views/User/Category/CategoryGetId.vue";
import CategoryView from "@/views/User/Category/CategoryView.vue";
import ProfileUpdateUser from "@/views/User/Profile/ProfileUpdateUser.vue";
import ProfileUser from "@/views/User/Profile/ProfileUser.vue";
import { createRouter, createWebHistory } from "vue-router";
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      component: PublicLayouts,
      children: [
        {
          path: "/",
          name: "Home",
          component: HomeView,
        },
        {
          path: "/category",
          name: "Category",
          component: CategoryView,
        },
        {
          path: "/category/:id",
          name: "CategoryGetIdUser",
          component: CategoryGetId,
        },
        {
          path: "/history-borrow",
          name: "HistoryBorrow",
          component: HistoryBorrow,
        },
        {
          path: "/book",
          name: "Book",
          component: BookView,
        },
        {
          path: "/book/:id",
          name: "BookGetId",
          component: BookGetId,
        },
        {
          path: "/borrow-book/:id",
          name: "BorrowBookUser",
          component: BorrowUser,
        },
        {
          path: "/profile-user",
          name: "ProfileUser",
          component: ProfileUser,
        },
        {
          path: "/profile-update-user",
          name: "ProfileUpdateUser",
          component: ProfileUpdateUser,
        },
      ],
    },
    {
      path: "/owner",
      component: OwnerLayout,
      meta: { isAuth: true, isOwner: true },
      children: [
        {
          path: "/owner",
          name: "Dashboard",
          component: DashboardView,
        },
        {
          path: "/owner/category",
          name: "CategoryOwner",
          component: CategoryViewOwner,
        },
        {
          path: "/owner/book",
          name: "BookOwner",
          component: BookViewOwner,
        },
        {
          path: "/owner/borrow",
          name: "BorrowOwner",
          component: BorrowView,
        },
        {
          path: "/owner/profile-owner",
          name: "ProfileOwner",
          component: ProfileOwner,
        },
        {
          path: "/owner/update-profile-owner",
          name: "ProfileOwnerUpdate",
          component: ProfileUpdateOwner,
        },
      ],
    },
    {
      path: "/login",
      name: "Login",
      component: LoginView,
      meta: { isAuthTrue: true },
    },
    {
      path: "/chat",
      name: "Chat",
      component: ChatView,
    },
    {
      path: "/callback",
      name: "GoogleCallback",
      component: () => import("@/components/Callback.vue"),
    },
    {
      path: "/register",
      name: "Register",
      component: RegisterView,
      meta: { isAuthTrue: true },
    },
    {
      path: "/:pathMatch(.*)*",
      name: "NotFound",
      component: NotFound,
    },
  ],
});

router.beforeEach(async (to, from) => {
  const authStore = await useAuthStore();
  if (to.meta.isAuthTrue && authStore.userToken) {
    return { name: "Home" };
  }
  if (to.meta.isAuth && !authStore.userToken) {
    return { path: "/" };
  }
  if (to.meta.isOwner && authStore.userData.role.name !== "owner") {
    return { name: "Home" };
  }
  if (to.meta.isUser && authStore.userData.role.name !== "user") {
    return { name: "Dashboard" };
  }
});

export default router;
