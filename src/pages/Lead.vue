<script lang="ts" setup>
import image from "../assets/images/lead-banner.png?url";
</script>

<template>
  <div class="">
    <img :src="image" class="object-cover w-full h-50vh" />
    <RepoSettings />
    <n-button
      type="primary"
      round
      size="large"
      class="absolute bottom-40px left-50% translate-x--50%"
      @click="$router.push({ name: 'Home' })"
    >
      完 成
    </n-button>
  </div>
</template>

<style lang="less" scoped></style>
