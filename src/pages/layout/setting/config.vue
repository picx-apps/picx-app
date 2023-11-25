<script lang="ts" setup>
import { Icon } from "@iconify/vue";
import { useSettingState } from "~/store/setting";

const { settings } = useSettingState();
</script>

<route lang="yaml">
name: settings_config
</route>

<template>
  <n-scrollbar style="height: 100vh">
    <Header :title="$t('system_config.title')">
      <template #default>
        <Icon
          icon="material-symbols:arrow-back-ios-rounded"
          class="text-1.2rem cursor-pointer hover:color-primary-200"
          @click="$router.replace({ name: 'user' })"
        />
      </template>
    </Header>

    <div class="px-16px">
      <n-code :code="JSON.stringify(settings)" language="json" word-wrap />
    </div>
  </n-scrollbar>
</template>

<style lang="less" scoped></style>
