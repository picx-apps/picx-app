<script lang="ts" setup>
import { getCurrent } from "@tauri-apps/api/window";
</script>

<template>
  <div class="h-30px select-none cursor-default" @mousedown="() => getCurrent().startDragging()"></div>
</template>

<style lang="less" scoped></style>
