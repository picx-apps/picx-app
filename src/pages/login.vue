<script lang="ts" setup>
import image from "../assets/images/login.png?url";
import { Icon } from "@iconify/vue";
import { shell } from "@tauri-apps/api";
import { useGlobalState } from "~/store";

const { t } = useI18n();
const router = useRouter();
const token = ref("");
const { authorize } = useGlobalState();

async function handleLogin() {
  const params = paramsSerializer({
    client_id: import.meta.env.VITE_CLIENT_ID,
    redirect_uri: import.meta.env.VITE_REDIRECT_URI,
    state: import.meta.env.VITE_STATE,
    scope: import.meta.env.VITE_SCOPE,
  });
  const uri = "https://github.com/login/oauth/authorize" + params;
  shell.open(uri);
  router.push("/callback");
}
function handleTokenSignIn() {
  authorize.value.access_token = token.value;
  router.push({ name: "lead" });
}
</script>

<route lang="yaml">
name: login
meta:
  public: true
</route>

<template>
  <div h-100vh class="login-container">
    <!-- <div class="flex-1 image max-sm:hidden"></div> -->
    <div class="pt-100px text-center">
      <div class="mb-30px w-full flex flex-col items-center">
        <n-image :src="image" width="200" />
        <div class="my-4px text-2rem font-bold lh-38px color-#545454 base-text-color">
          {{ t("welcome") }}
        </div>
        <p class="my-0 color-gray">{{ t("login.detail") }}</p>
      </div>

      <div w-300px text-center m-auto mt-20px>
        <n-input
          v-model:value="token"
          type="password"
          placeholder="Please enter"
          class="w-300px h-45px mb-20px"
        ></n-input>
      </div>
      <n-button class="w-300px h-45px mb-20px" @click="handleTokenSignIn"> Sign in </n-button>

      <div>
        <n-button quaternary @click="handleLogin" class="w-300px h-45px login-button">
          <Icon icon="mdi:github" class="text-20px mr-10px" />
          <span class="max-w-120px"> {{ t("login.github_login") }} </span>
        </n-button>
      </div>
    </div>
  </div>
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
