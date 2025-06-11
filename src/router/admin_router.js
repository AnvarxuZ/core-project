export const admin_router = [
  {
    path: "admin",
    meta: { title: "admin" },
    component: () => import("@/views/pages/admin/Index.vue"),
    children: [
      {
        path: "",
        name: "admin",
        meta: { title: "users" },
        component: () => import("@/views/pages/admin/users/Index.vue"),
      },
      {
        path: "user",
        name: "users",
        meta: { title: "users" },
        component: () => import("@/views/pages/admin/users/Index.vue"),
      },
      {
        path: "role",
        name: "roles",
        meta: { title: "roles" },
        component: () => import("@/views/pages/admin/roles/Index.vue"),
      },
      {
        path: "permission",
        name: "permissions",
        meta: { title: "permissions" },
        component: () => import("@/views/pages/admin/permissions/Index.vue"),
      },
      {
        path: "language",
        name: "languages",
        meta: { title: "languages" },
        component: () => import("@/views/pages/admin/languages/Index.vue"),
      },
      {
        path: "setting",
        name: "setting",
        meta: { title: "setting" },
        component: () => import("@/views/pages/admin/setting/Index.vue"),
      }
    ],
  },
];
