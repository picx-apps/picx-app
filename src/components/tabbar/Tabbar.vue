<script lang="ts" setup>
import { Icon } from "@iconify/vue";
</script>

<template>
  <div class="tabbar">
    <TabbarItem name="home" text="Home">
      <Icon
        icon="material-symbols:home-rounded"
        class="text-26px select-none"
      ></Icon>
    </TabbarItem>
    <TabbarItem name="upload" text="Upload">
      <Icon icon="ri:upload-cloud-2-line" class="text-26px select-none"></Icon>
    </TabbarItem>
    <TabbarItem name="user" text="User">
      <Icon icon="ri:user-smile-line" class="text-26px select-none"></Icon>
    </TabbarItem>
  </div>
</template>

<style lang="less" scoped>
.tabbar {
  position: fixed;
  bottom: 14px;
  left: 50%;
  transform: translateX(-50%);
  max-width: 600px;
  min-width: 300px;
  background: var(--tabbar-background);
  padding: 14px 20px;
  border-radius: 18px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
}
</style>
