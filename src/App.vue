<script setup lang="ts">
import { themeOverrides } from "./theme";
</script>

<template>
  <RouterView v-slot="{ Component }">
    <template v-if="Component">
      <Transition mode="out-in">
        <KeepAlive>
          <Suspense>
            <transition name="fade">
              <n-config-provider :theme-overrides="themeOverrides">
                <n-notification-provider>
                  <n-message-provider>
                    <!-- <n-theme-editor> -->
                    <!-- 主要内容 -->
                    <component :is="Component"></component>
                    <!-- </n-theme-editor> -->
                  </n-message-provider>
                </n-notification-provider>
              </n-config-provider>
            </transition>

            <!-- 加载中状态 -->
            <template #fallback> 正在加载... </template>
          </Suspense>
        </KeepAlive>
      </Transition>
    </template>
  </RouterView>
</template>
