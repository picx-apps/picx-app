<script lang="ts" setup>
import { invoke } from "@tauri-apps/api";
import type { UserConfig } from "../types/auth";
import { userStore } from "../pinia/auth";

const route = useRoute();
const router = useRouter();
const code = route.query.code as string;
const { setAuth } = userStore();

onMounted(async () => {
  const config: UserConfig = await invoke("get_access_token", { code });
  setAuth(config.token);
  router.push("/");
});
</script>

<template>callback</template>

<style lang="less" scoped></style>
