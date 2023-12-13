<script lang="ts" setup>
import { useGlobalState } from "../store";
import { SchemePayload } from "../types";
import { Icon } from "@iconify/vue";
import { event } from "@tauri-apps/api";
import { open } from "@tauri-apps/api/shell";

const router = useRouter();
const { onInstallation } = useGlobalState();

event.listen("scheme-request-received", async (event) => {
  const payload = event.payload as SchemePayload;
  //应用安装
  if (payload.base === "installations") {
    router.push({ name: "lead" });
  }
});
async function handleSign() {
  onInstallation().then(() => {
    router.push({ name: "lead" });
  });
}
function reInstall() {
  open(import.meta.env.VITE_INSTALL_URL + "/installations/new");
}

onMounted(() => {
  handleSign();
});
</script>

<route lang="yaml">
name: installation_callback
meta:
  public: true
</route>

<template>
  <div class="flex flex-col items-center justify-center h-90vh">
    <div class="flex items-center justify-center">
      <Icon icon="fluent-emoji:carrot" class="text-4rem" />
      <h2 class="text-2.4rem ml-4px my-0">Picx</h2>
    </div>
    <h1 class="color-white text-2rem">前往浏览器以登陆</h1>
    <h2 class="text-1rem color-gray-6">
      没有看到浏览器选项卡？<span class="color-white cursor-pointer" @click="reInstall">再试一次</span>
    </h2>
  </div>
</template>

<style lang="less" scoped></style>
