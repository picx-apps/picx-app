<script setup lang="ts">
import { themeOverrides } from "./theme";
import { useSettingState } from "./store/setting";
onMounted(() => {
  useSettingState().autoCreateOfSettings();
});
</script>

<template>
  <RouterView v-slot="{ Component }">
    <template v-if="Component">
      <n-config-provider :theme-overrides="themeOverrides">
        <n-notification-provider>
          <n-message-provider>
            <n-dialog-provider>
              <!-- <n-theme-editor> -->
              <KeepAlive>
                <Suspense>
                  <!-- 主要内容 -->
                  <component :is="Component"></component>

                  <!-- 加载中状态 -->
                  <template #fallback> 正在加载... </template>
                </Suspense>
              </KeepAlive>
              <!-- </n-theme-editor> -->
            </n-dialog-provider>
          </n-message-provider>
        </n-notification-provider>
      </n-config-provider>
    </template>
  </RouterView>
</template>
