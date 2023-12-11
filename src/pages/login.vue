<script lang="ts" setup>
import image from "../assets/images/login.png?url";
import { Icon } from "@iconify/vue";
import { shell } from "@tauri-apps/api";

const { t } = useI18n();
const router = useRouter();

async function handleLogin() {
  const uri = "https://picx.qzzhu.cn/login";
  shell.open(uri);
  router.push("/callback");
}
</script>

<route lang="yaml">
name: login
meta:
  public: true
</route>

<template>
  <div h-100vh class="login-container">
    <LayoutHeader />
    <!-- <div class="flex-1 image max-sm:hidden"></div> -->
    <div class="pt-100px text-center">
      <div class="mb-30px w-full flex flex-col items-center">
        <n-image :src="image" width="200" />
        <div class="my-4px text-2rem font-bold lh-38px color-#545454 base-text-color">
          {{ t("welcome") }}
        </div>
        <p class="my-0 color-gray">{{ t("login.detail") }}</p>
      </div>

      <!-- <div class="my-4px text-.9rem font-500 color-#545454">Token</div>
      <n-input
        v-model="token"
        type="password"
        placeholder="Please enter"
        class="mb-20px"
      ></n-input> -->

      <!-- <n-button type="primary" class="w-100% mb-20px" @click="handleSignToken">
        Sign in
      </n-button> -->

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
