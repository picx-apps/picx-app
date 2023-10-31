import {
  createRouter,
  createWebHistory,
  type RouteRecordRaw,
} from "vue-router";
import { userStore } from "../pinia/auth";

const routes: Array<RouteRecordRaw> = [
  {
    name: "home",
    path: "/",
    component: () => import("~/pages/Home.vue"),
  },
  {
    name: "Login",
    path: "/login",
    component: import("~/pages/Login.vue"),
    meta: {
      public: true,
    },
  },
  {
    name: "Callback",
    path: "/callback",
    component: () => import("~/pages/Callback.vue"),
    meta: {
      public: true,
    },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes: routes,
});

router.beforeEach((to, from, next) => {
  const auth = userStore().getAuth;
  if (to.meta.public) {
    next();
  } else if (!auth || !auth.access_token) {
    next("/login");
  } else {
    next();
  }
});

export default router;
