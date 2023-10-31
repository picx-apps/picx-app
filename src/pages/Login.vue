<script lang="ts" setup>
import { Icon } from "@iconify/vue";
import { invoke } from "@tauri-apps/api";

async function handleLogin() {
  const uri: string = await invoke("login_uri");
  location.href = uri;
}
</script>

<template>
  <div flex h-100vh>
    <div class="flex-1 image"></div>
    <div class="w-400px flex items-center justify-center flex-col">
      <n-button type="info" round ghost @click="handleLogin">
        <Icon icon="mdi:github" class="text-18px" /> Continue with Github
      </n-button>
    </div>
  </div>
</template>

<style lang="less" scoped>
.image {
  background-image: url("../assets/images/login-banner.png");
  background-position: center;
  background-size: cover;
}
</style>
