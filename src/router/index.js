import { createRouter, createWebHistory } from "vue-router";
import IndexView from "../views/layout/Index.vue";
import { admin_router } from "./admin_router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      component: IndexView,
      children: [
        {
          path: "",
          name: "home",
          meta: { title: "home" },
          component: () => import("@/views/pages/Index.vue"),
        },
        ...admin_router,
        {
          path: "/:catchAll(.*)",
          name: "NotFound",
          component: () => import("@/views/layout/404.vue"),
          meta: { requiresAuth: false, title: "404" },
        },
      ],
    },
    {
      path: "/login",
      name: "login",
      component: () => import("@/views/layout/Login.vue"),
    },
  ],
});

export default router;
