<script lang="ts" setup>
import Step1 from "../components/lead/Step1.vue";
import Step2 from "../components/lead/Step2.vue";
import type { LeadConfig } from "../types";
const step = ref(1);
const stepInstance1 = ref<InstanceType<typeof Step1>>();
const stepInstance2 = ref<InstanceType<typeof Step2>>();
const config = ref<LeadConfig>({
  isNewRepo: undefined,
  repoName: undefined,
  branchName: undefined,
});

function handlePrev() {
  if (step.value === 1) return;
  step.value--;
}
function handleNext() {
  if (step.value === 3) return;
  if (step.value === 1 && !stepInstance1.value?.validate()) {
    return;
  }
  if (step.value === 2 && !stepInstance2.value?.validate()) {
    return;
  }
  step.value++;
}
</script>

<route lang="yaml">
name: lead
meta:
  public: true
</route>

<template>
  <div class="lead-container">
    <div>
      <div
        class="my-4px text-2rem font-bold lh-38px color-#545454 base-text-color"
      >
        欢迎来到 PICX
      </div>
      <p class="my-0 color-gray">我们来一起初始化您的个性图库</p>
    </div>

    <div v-show="step === 1">
      <Step1 v-model="config.isNewRepo" ref="stepInstance1" />
    </div>
    <div v-show="step === 2" class="max-w-400px w-90%">
      <Step2 v-model="config" ref="stepInstance2" />
    </div>

    <div
      class="absolute bottom-40px left-50% translate-x--50% w-200px flex justify-center"
    >
      <n-button
        type="primary"
        round
        ghost
        size="large"
        class="mx-10px"
        @click="handlePrev"
        v-show="step > 1"
      >
        上一步
      </n-button>
      <n-button
        type="primary"
        round
        size="large"
        class="mx-10px"
        @click="handleNext"
      >
        下一步
      </n-button>
    </div>
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
