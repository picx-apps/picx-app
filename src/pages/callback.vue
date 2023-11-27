<script lang="ts" setup>
import { useGlobalState } from "../store";
import { SchemePayload } from "../types";
import { Icon } from "@iconify/vue";
import { event } from "@tauri-apps/api";

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
  <div class="text-center pt-30px">
    <Icon icon="arcticons:kul-authenticator" class="text-3rem" />
    <h2 class="color-gray-7">Waiting for authorization to return</h2>
  </div>
</template>

<style lang="less" scoped></style>
