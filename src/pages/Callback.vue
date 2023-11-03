<script lang="ts" setup>
import { invoke } from "@tauri-apps/api";
import type { UserConfig } from "../types/auth";
import { useGlobalState } from "../store";

const route = useRoute();
const router = useRouter();
const code = route.query.code as string;
const { set_authorize } = useGlobalState();

onMounted(async () => {
  const config: UserConfig = await invoke("get_access_token", { code });
  set_authorize(config.token);
  router.push({ name: "lead" });
});
</script>

<route lang="yaml">
name: callback
meta:
  public: true
</route>

<template>callback</template>

<style lang="less" scoped></style>
