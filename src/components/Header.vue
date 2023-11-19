<script lang="ts" setup>
defineProps<{ title?: string }>();
defineSlots<{
  default: string;
  title: void;
  optional: void;
}>();
</script>

<template>
  <div class="header p-10px px-16px flex items-center">
    <div class="flex items-center w-100px">
      <h1 class="m-0"><slot></slot></h1>
    </div>

    <div class="flex-1 text-center text-1.1rem color-gray-600 dark:color-white">
      <slot name="title">{{ title }}</slot>
    </div>

    <div class="optional w-100px text-right">
      <slot name="optional"></slot>
    </div>
  </div>
</template>

<style lang="less" scoped></style>
