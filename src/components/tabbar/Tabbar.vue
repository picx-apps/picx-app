<script lang="ts" setup>
import { Icon } from "@iconify/vue";
</script>

<template>
  <div class="tabbar">
    <TabbarItem name="home">
      <Icon icon="ri:home-3-line" class="text-20px select-none"></Icon>
    </TabbarItem>
    <TabbarItem name="upload">
      <Icon icon="ri:upload-cloud-2-line" class="text-20px select-none"></Icon>
    </TabbarItem>
    <TabbarItem name="user">
      <Icon icon="ri:user-smile-line" class="text-20px select-none"></Icon>
    </TabbarItem>
  </div>
</template>

<style lang="less" scoped>
.tabbar {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  max-width: 600px;
  min-width: 300px;
  background: var(--color-primary);
  padding: 14px 20px;
  border-radius: 18px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>
