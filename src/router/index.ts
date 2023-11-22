//https://github.com/hannoeru/vite-plugin-pages
import { useGlobalState } from "../store";
import routes from "~pages";
import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({ routes: routes, history: createWebHistory() });
console.log(router.getRoutes());

router.beforeEach((to, from, next) => {
  const { access_token } = useGlobalState();
  if (to.meta.public) {
    next();
  } else if (!access_token.value) {
    next("/login");
  } else {
    next();
  }
});

export default router;
