<script lang="ts" setup>
import LayoutComponent from "~/components/layout/index.vue";
</script>

<template>
  <LayoutComponent>
    <RouterView v-slot="{ Component }">
      <KeepAlive>
        <Suspense>
          <!-- 主要内容 -->
          <component :is="Component"></component>

          <!-- 加载中状态 -->
          <template #fallback> 正在加载... </template>
        </Suspense>
      </KeepAlive>
    </RouterView>
  </LayoutComponent>
</template>
