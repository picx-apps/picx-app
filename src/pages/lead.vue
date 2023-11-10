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
const { t } = useI18n();

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
</script>

<route lang="yaml">
name: lead
</route>

<template>
  <div class="flex justify-center h-screen">
    <div class="px-16px max-w-500px min-w-350px">
      <div class="mt-100px w-full mb-50px">
        <div
          class="my-4px text-2rem font-bold lh-38px color-#545454 base-text-color"
        >
          {{ t("welcome") }}
        </div>
        <p class="my-0 color-gray">
          {{ t("init.init_repo_info") }}
        </p>
      </div>

      <div v-show="step === 1">
        <Step1 v-model="config.isNewRepo" @update:model-value="step++" />
      </div>
      <div v-show="step === 2">
        <Step2 v-if="config.isNewRepo === true" v-model="config" />
        <Step2Create v-else ref="stepCreateInstance" />
      </div>

      <div
        class="absolute bottom-40px left-50% translate-x--50% w-200px flex justify-center"
        v-show="step === 2"
      >
        <n-button
          type="primary"
          round
          ghost
          size="large"
          class="mx-10px"
          @click="handlePrev"
        >
          {{ t("back") }}
        </n-button>
        <n-button
          type="primary"
          round
          size="large"
          class="mx-10px"
          @click="handleNext"
        >
          {{ t("complete") }}
        </n-button>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped></style>
