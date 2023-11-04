<script lang="ts" setup>
import { Icon } from "@iconify/vue";
import { invoke } from "@tauri-apps/api";

const token = ref("");

async function handleLogin() {
  const uri: string = await invoke("login_uri");
  location.href = uri;
}
function handleSignToken() {}
</script>

<route lang="yaml">
name: login
meta:
  public: true
</route>

<template>
  <div flex h-100vh class="login-container">
    <!-- <div class="flex-1 image max-sm:hidden"></div> -->
    <div
      class="max-w-600px min-w-400px flex items-start justify-center flex-col"
      px-40px
    >
      <div class="mb-30px">
        <div
          class="my-4px text-2rem font-bold lh-38px color-#545454 base-text-color"
        >
          Welcome Picx
        </div>
        <p class="my-0 color-gray">Welcome back! Please enter your details.</p>
      </div>

      <div class="my-4px text-.9rem font-500 color-#545454">Token</div>
      <n-input
        v-model="token"
        type="password"
        placeholder="Please enter"
        class="mb-20px"
      ></n-input>

      <n-button
        type="primary"
        ghost
        class="w-100% mb-20px"
        @click="handleSignToken"
      >
        Sign in
      </n-button>

      <n-button
        type="primary"
        ghost
        @click="handleLogin"
        class="w-100% mb-10px"
      >
        <Icon icon="mdi:github" class="text-20px mr-10px" />
        <span class="w-120px"> Continue with Github </span>
      </n-button>
    </div>
  </div>
</template>

<style lang="less" scoped>
.login-container {
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  transform: translateY(-80px);
}
.image {
  background-image: url("../assets/images/login-banner.png");
  background-position: center;
  background-size: cover;
}
</style>
