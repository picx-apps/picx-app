<script setup lang="ts">
import { themeOverrides } from "./theme";
</script>

<template>
  <n-config-provider :theme-overrides="themeOverrides">
    <n-theme-editor>
      <RouterView v-slot="{ Component }">
        <template v-if="Component">
          <Transition mode="out-in">
            <KeepAlive>
              <Suspense>
                <transition name="fade">
                  <!-- 主要内容 -->
                  <component :is="Component"></component>
                </transition>

                <!-- 加载中状态 -->
                <template #fallback> 正在加载... </template>
              </Suspense>
            </KeepAlive>
          </Transition>
        </template>
      </RouterView>
      <Tabbar />
    </n-theme-editor>
  </n-config-provider>
</template>
