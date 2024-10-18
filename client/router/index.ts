import { storeToRefs } from "pinia";
import { createRouter, createWebHistory } from "vue-router";

import { useUserStore } from "@/stores/user";
import CreatePostView from "../views/CreatePostView.vue";
import HomeView from "../views/HomeView.vue";
import LoginView from "../views/LoginView.vue";
import NotFoundView from "../views/NotFoundView.vue";
import PostDetailsView from "../views/PostDetailsView.vue";
import SettingView from "../views/SettingView.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "Home",
      component: HomeView,
    },
    {
      path: "/createPost",
      name: "Create Post",
      component: CreatePostView,
      meta: { requiresAuth: true }
    },
    {
      path: "/postDetails/:id",
      name: "Post Details",
      component: PostDetailsView,
      meta: { requiresAuth: true }
    },
    {
      path: "/setting",
      name: "Settings",
      component: SettingView,
      meta: { requiresAuth: true },
    },
    {
      path: "/login",
      name: "Login",
      component: LoginView,
      meta: { requiresAuth: false },
      beforeEnter: (to, from) => {
        const { isLoggedIn } = storeToRefs(useUserStore());
        if (isLoggedIn.value) {
          return { name: "Settings" };
        }
      },
    },
    {
      path: "/:catchAll(.*)",
      name: "not-found",
      component: NotFoundView,
    },
  ],
});

/**
 * Navigation guards to prevent user from accessing wrong pages.
 */
router.beforeEach((to, from) => {
  const { isLoggedIn } = storeToRefs(useUserStore());

  if (to.meta.requiresAuth && !isLoggedIn.value) {
    return { name: "Login" };
  }
});

export default router;
