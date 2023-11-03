<script lang="ts" setup>
import type { LeadConfig } from "../types";
const step = ref(1);
const config = ref<LeadConfig>({
  isNewRepo: undefined,
});
</script>

<route lang="yaml">
name: lead
meta:
  public: true
</route>

<template>
  <div class="lead-container">
    <Step1 v-show="step === 1" v-model="config.isNewRepo" />

    <n-button
      type="primary"
      round
      size="large"
      class="absolute bottom-40px left-50% translate-x--50%"
      @click="$router.push({ name: 'home' })"
    >
      下一步
    </n-button>
  </div>
</template>

<style lang="less" scoped>
.lead-container {
  height: 100vh;
  background: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  transform: translateY(-80px);
}
</style>
