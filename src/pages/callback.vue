<script lang="ts" setup>
import { useGlobalState } from "../store";
import { SchemePayload } from "../types";
import { Icon } from "@iconify/vue";
import { event, shell } from "@tauri-apps/api";

const router = useRouter();
const { set_authorize, get_userinfo, checkUserInstallApps, access_token } = useGlobalState();

event.listen("scheme-request-received", async (event) => {
  const payload = event.payload as SchemePayload;
  const params = new URLSearchParams(payload.query);
  //身份认证
  if (payload.base === "authorization") {
    const scope = params.get("scope")!;
    const token_type = params.get("token_type")!;
    const access_token = params.get("access_token")!;
    set_authorize({
      scope,
      token_type,
      access_token,
    });
    handleSign();
  }
  //应用安装
  if (payload.base === "installations") {
    router.push({ name: "lead" });
  }
});
async function handleSign() {
  if (!access_token.value) return;
  const userinfo = await get_userinfo();
  if (await checkUserInstallApps(userinfo.login)) {
    router.push({ name: "lead" });
  } else {
    router.push({ name: "installations" });
  }
}
function reLogin() {
  const uri = "https://picx.qzzhu.cn/login";
  shell.open(uri);
}

onMounted(() => {
  handleSign();
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
      <Icon icon="fluent-emoji:carrot" class="text-4rem" />
      <h2 class="text-2.4rem ml-4px my-0">Picx</h2>
    </div>
    <h1 class="color-white text-2rem">前往浏览器以登陆</h1>
    <h2 class="text-1rem color-gray-6">
      没有看到浏览器选项卡？<span class="color-white cursor-pointer" @click="reLogin">再试一次</span>
    </h2>
  </div>
</template>

<style lang="less" scoped></style>
