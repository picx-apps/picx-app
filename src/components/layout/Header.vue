<script lang="ts" setup>
import { getCurrent, LogicalSize } from "@tauri-apps/api/window";

async function dbClick() {
  const appWindow = getCurrent();
  const isMax = await appWindow.isMaximized();
  if (isMax === false) {
    appWindow.maximize();
  } else {
    appWindow.setSize(new LogicalSize(1235, 930));
  }
}
</script>

<template>
  <div
    class="h-30px select-none cursor-default"
    @dblclick="dbClick"
    @mousedown="() => getCurrent().startDragging()"
  ></div>
</template>

<style lang="less" scoped></style>
