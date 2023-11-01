<script setup lang="ts">
import { themeOverrides } from "./theme";
</script>

<template>
  <n-config-provider :theme-overrides="themeOverrides">
    <n-theme-editor>
      <router-view></router-view>
    </n-theme-editor>
  </n-config-provider>
</template>
