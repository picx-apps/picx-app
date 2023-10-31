<script lang="ts" setup>
import { invoke } from "@tauri-apps/api";

async function handleClick() {
  const state = await invoke("get_user_state");
  console.log("user state", state);
}
</script>

<template>
  <n-button @click="handleClick">userState</n-button>
</template>

<style lang="less" scoped></style>
