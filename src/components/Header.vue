<script lang="ts" setup>
import { useGlobalState } from "../store";
defineSlots<{
  optional: void;
}>();
const { user } = useGlobalState();
</script>

<template>
  <div class="header p-10px px-16px flex items-center">
    <div flex-1 class="flex items-center">
      <img
        :src="user?.avatar_url"
        :alt="user?.login"
        class="w-46px h-46px rounded-full mr-8px avatar"
      />
      <div>
        <div class="text-18px lh-20px font-bold">
          {{ user?.name || user?.login }}
        </div>
        <div class="bio">晚上好，欢迎回来~</div>
      </div>
    </div>

    <div class="optional">
      <slot name="optional"></slot>
    </div>
  </div>
</template>

<style lang="less" scoped>
.avatar {
  border: 4px solid rgba(127, 151, 208, 0.33);
}
.bio {
  margin-top: 4px;
  font-size: 11px;
  line-height: 16px;
  color: #959595;
  border-radius: 10px;
}
</style>
