//https://github.com/hannoeru/vite-plugin-pages
import { useGlobalState } from "../store";
import routes from "~pages";
import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({ routes: routes, history: createWebHistory() });
console.log(router.getRoutes());

router.beforeEach(async (to, from, next) => {
  const { userinfo, access_token, isInstalled, initUserInstallApp } = useGlobalState();
  !isInstalled.value && userinfo.value?.login && (await initUserInstallApp(userinfo.value?.login));

  if (!to.meta.public && !access_token.value) {
    next({ name: "login" });
  } else if (!to.meta.public && access_token.value && isInstalled.value === false && to.name !== "installations") {
    next({ name: "installations" });
  } else {
    next();
  }
});

export default router;
