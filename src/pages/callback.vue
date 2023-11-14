<script lang="ts" setup>
import { invoke } from "@tauri-apps/api";
import type { UserToken } from "../types/auth";
import { useGlobalState } from "../store";
import { event } from "@tauri-apps/api";

const router = useRouter();
const { set_authorize } = useGlobalState();

event.listen("scheme-request-received", async (event) => {
  const payload = event.payload as string;
  if (!payload) return;
  const params = new URLSearchParams(payload.split("?")[1]);
  const code = params.get("code");
  const token: UserToken = await invoke("get_access_token", { code });
  set_authorize(token);
  router.push({ name: "lead" });
});
</script>

<route lang="yaml">
name: callback
meta:
  public: true
</route>

<template>
  <h2>Waiting for authorization to return</h2>
</template>

<style lang="less" scoped></style>
