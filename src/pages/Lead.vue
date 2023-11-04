<script lang="ts" setup>
import Step2Create from "../components/lead/Step2Create.vue";
import { useGlobalState } from "../store";
import type { LeadConfig } from "../types";

const step = ref(1);
const router = useRouter();
const stepCreateInstance = ref<InstanceType<typeof Step2Create>>();
const notification = useNotification();
const config = ref<LeadConfig>({
  isNewRepo: undefined,
  repoName: undefined,
  branchName: undefined,
});
const { set_repository } = useGlobalState();

function handlePrev() {
  if (step.value === 1) return;
  step.value--;
}
function setRepo() {
  set_repository({
    repo_name: config.value.repoName,
    branch_name: config.value.branchName,
  });
}
async function handleNext() {
  const { isNewRepo, repoName, branchName } = config.value;
  if (step.value === 1 && isNewRepo === undefined) {
    return notification.warning({
      content: "Please select an option",
      duration: 1000,
    });
  }
  if (step.value === 2) {
    if (isNewRepo === true) {
      if (!repoName && !branchName)
        return notification.warning({
          content: "请选择仓库和分支",
          duration: 1000,
        });
      setRepo();
      return router.push({ name: "home" });
    }
    if (isNewRepo === false) {
      const res = await stepCreateInstance.value?.createRepo();
      if (res?.status === 201) {
        notification.success({
          content: "创建成功",
          duration: 1000,
        });
        config.value.repoName = res.data.name;
        config.value.branchName = res.data.default_branch;
        setRepo();
        return router.push({ name: "home" });
      } else if (res?.status === 422) {
        return notification.error({
          content: "仓库名已存在",
          duration: 1000,
        });
      } else if (res?.status === 403) {
        return notification.error({
          content: "您没有创建仓库的权限,请联系作者",
          duration: 1000,
        });
      } else {
        return notification.error({
          content: "其他错误",
          duration: 1000,
        });
      }
    }
  }
  step.value++;
}
</script>

<route lang="yaml">
name: lead
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
      <Step1 v-model="config.isNewRepo" />
    </div>
    <div v-show="step === 2" class="max-w-400px w-90%">
      <Step2 v-if="config.isNewRepo === true" v-model="config" />
      <Step2Create v-else ref="stepCreateInstance" />
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
