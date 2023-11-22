<script lang="ts" setup>
import { useSettingState } from "../../store/setting";
import { Icon } from "@iconify/vue";

const { settings } = useSettingState();
</script>

<template>
  <n-scrollbar style="height: 100vh">
    <Header :title="$t('system_config.title')">
      <template #default>
        <Icon
          icon="material-symbols:arrow-back-ios-rounded"
          class="text-1.2rem cursor-pointer hover:color-primary-200"
          @click="$router.replace('/user')"
        />
      </template>
    </Header>

    <div class="px-16px">
      <n-code :code="JSON.stringify(settings)" language="json" word-wrap />
    </div>
  </n-scrollbar>
</template>

<style lang="less" scoped></style>
