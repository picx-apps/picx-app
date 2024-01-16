<script lang="ts" setup>
import image from "../assets/images/login.png?url";
import { Icon } from "@iconify/vue";
import { listen } from "@tauri-apps/api/event";
import { useGlobalState } from "~/store";
import { useWindowState } from "~/store/window";

const { t } = useI18n();
const router = useRouter();
const { createAuthWindow } = useWindowState();
const { login_uri } = useGlobalState();
const loading = ref(false);
console.log(login_uri);

async function handleLogin() {
  loading.value = true;
  await createAuthWindow();
}

listen("auth:success", () => {
  loading.value = false;
  router.push({ name: "lead" });
});
</script>

<route lang="yaml">
name: login
meta:
  public: true
</route>

<template>
  <n-spin class="login-container" :show="loading" style="--n-color: white">
    <div class="pt-100px text-center">
      <div class="mb-30px w-full flex flex-col items-center">
        <n-image :src="image" width="200" />
        <div class="my-4px text-2rem font-bold lh-38px color-#545454 base-text-color">
          {{ t("welcome") }}
        </div>
        <p class="my-0 color-gray">{{ t("login.detail") }}</p>
      </div>

      <div>
        <n-button quaternary @click="handleLogin" class="w-300px h-45px login-button">
          <Icon icon="mdi:github" class="text-20px mr-10px" />
          <span class="max-w-120px"> {{ t("login.github_login") }} </span>
        </n-button>
      </div>
    </div>
  </n-spin>
</template>

<style lang="less" scoped>
.login-container {
  padding: 0 30px;
}
.image {
  background-image: url("../assets/images/login-banner.png");
  background-position: center;
  background-size: cover;
}
.login-button {
  background: linear-gradient(120deg, #5ee6dd, #9ea5ff, #e491fd);
  color: white;
  &:hover {
    color: white;
  }
}
</style>
