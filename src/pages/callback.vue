<script lang="ts" setup>
import { useGlobalState } from "../store";
import { UserToken } from "../types";
// import { Icon } from "@iconify/vue";
import { invoke } from "@tauri-apps/api";

const route = useRoute();
const router = useRouter();
const { login_uri, env, set_authorize, get_userinfo, access_token, onInstallation } = useGlobalState();
const isError = ref(false);

async function handleSign() {
  if (!access_token.value) {
    isError.value = true;
    return;
  }
  await get_userinfo().catch(() => {
    isError.value = true;
    return;
  });
  onInstallation()
    .then(() => {
      router.push({ name: "lead" });
    })
    .catch(() => {
      router.push({ name: "installations" });
    });
}
function reLogin() {
  location.href = login_uri;
}
async function login() {
  const code = route.query.code as string;
  if (!code) {
    isError.value = true;
    return;
  }
  const user_token = (await invoke("get_access_token", {
    config: {
      code,
      ...env,
    },
  })) as UserToken;
  set_authorize(user_token);
  handleSign();
}

onMounted(() => {
  login();
});
</script>

<route lang="yaml">
name: callback
meta:
  public: true
</route>

<template>
  <div class="flex flex-col items-center justify-center h-90vh">
    <div class="flex items-center justify-center">
      <!-- <Icon icon="fluent-emoji:carrot" class="text-4rem" /> -->
      <h2 class="text-2.4rem ml-4px my-0">Picx App</h2>
    </div>
    <h1 class="color-white text-1.8rem" v-show="!isError">正在授权登陆中,请稍后...</h1>
    <h1 class="text-1.4rem color-gray-6 my-2xl" v-show="isError">
      授权中发生意外错误, 是否
      <span class="color-indigo cursor-pointer text-1rem ml-5px" @click="reLogin">再试一次</span>
    </h1>
  </div>
</template>

<style lang="less" scoped></style>
