<script lang="ts" setup>
import image from "../assets/images/lead-banner.png?url";
import { Icon } from "@iconify/vue";

const step = ref(0);
</script>

<route lang="yaml">
name: lead
</route>

<template>
  <div>
    <img :src="image" class="object-cover w-full h-50vh" />

    <RepoSettings v-if="step !== 0" />

    <div class="py-20px">
      <div class="flex justify-center">
        <div class="select-container">
          <div class="flex flex-col items-center justify-center h-full">
            <Icon icon="tabler:arrow-bounce" class="text-80px" />
            <span class="text-13px"> 已有仓库 </span>
          </div>
        </div>

        <div class="select-container plain">
          <div class="flex flex-col items-center justify-center h-full">
            <Icon icon="tabler:plus" class="text-80px" />
            <span class="text-13px"> 创建仓库 </span>
          </div>
        </div>
      </div>

      <!-- <n-button type="primary" ghost class="w-100% mb-10px">
        <Icon icon="tabler:brand-citymapper" class="text-20px mr-10px" />
        <div class="w-80px text-left">选择已有仓库</div>
      </n-button>
      <n-button type="primary" class="w-100% mb-10px">
        <Icon icon="tabler:plus" class="text-20px mr-10px" />
        <span class="w-80px text-left"> 创建新仓库 </span>
      </n-button> -->

      <n-button
        v-if="step !== 0"
        type="primary"
        round
        size="large"
        class="absolute bottom-40px left-50% translate-x--50%"
        @click="$router.push({ name: 'home' })"
      >
        完 成
      </n-button>
    </div>
  </div>
</template>

<style lang="less" scoped>
.select-container {
  width: 150px;
  height: 150px;
  color: white;
  background: var(--color-primary);
  border-radius: 10px;
  cursor: pointer;
  margin: 0 20px;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.2);
  user-select: none;
  -webkit-touch-callout: none;
  -webkit-text-size-adjust: none;
  -webkit-tap-highlight-color: transparent;
  -webkit-user-select: none;
  &:active {
    transform: scale(0.99);
  }
  &.plain {
    color: var(--color-primary);
    background: white;
    border: 1px solid var(--color-primary);
  }
}
</style>
