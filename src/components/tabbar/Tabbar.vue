<script lang="ts" setup>
import { Icon } from "@iconify/vue";
</script>

<template>
  <div class="tabbar">
    <TabbarItem name="Home">
      <Icon icon="ri:home-3-line" class="text-20px select-none"></Icon>
    </TabbarItem>
    <TabbarItem name="Upload">
      <Icon icon="ri:upload-cloud-2-line" class="text-20px select-none"></Icon>
    </TabbarItem>
    <TabbarItem name="User">
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
  background-color: white;
  padding: 14px 20px;
  border-radius: 18px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>
