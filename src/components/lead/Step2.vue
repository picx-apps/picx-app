<script lang="ts" setup>
import type { BranchInfo, LeadConfig, RepoInfo } from "../../types";
import { Octokit } from "octokit";
import { useGlobalState } from "../../store";
import { Icon } from "@iconify/vue";
import { isEmpty } from "lodash-es";

const props = defineProps<{
  modelValue: LeadConfig;
}>();
const emit = defineEmits(["update:modelValue"]);
const modelValue = useVModel(props, "modelValue", emit);
const { access_token, user } = useGlobalState();
const repoOptions = ref<RepoInfo[]>([]);
const branchOptions = ref<BranchInfo[]>([]);
const octokit = new Octokit({ auth: access_token.value });
const repoVisible = ref(false);
const branchVisible = ref(false);
const [DefineTemplate, ReuseTemplate] = createReusableTemplate<{
  icon: string;
  title: string;
  label: string;
  value: string;
}>();

const [DefineOption, ReuseOption] = createReusableTemplate<{
  icon: string;
  title: string;
  label?: string;
  value?: string;
}>();
const { t } = useI18n();

async function initRepo() {
  const { data } = await octokit.request("GET /search/repositories", {
    q: `user:${user.value?.login}+`,
    sort: "stars",
    per_page: 100,
  });
  repoOptions.value = data.items;
}
async function initBranches() {
  if (modelValue.value.repoName) {
    const { data } = await octokit.request(
      "GET /repos/{owner}/{repo}/branches",
      {
        owner: user.value?.login!,
        repo: modelValue.value.repoName,
      }
    );
    branchOptions.value = data;
  }
}
function handleClickRepo(item: RepoInfo) {
  modelValue.value.repoName = item.name;
  modelValue.value.branchName = item.default_branch;
  repoVisible.value = false;
  initBranches();
}
function handleClickBranch(item: BranchInfo) {
  modelValue.value.branchName = item.name;
  branchVisible.value = false;
}

onMounted(() => {
  initRepo();
});

watch(
  modelValue,
  (value) => {
    console.log(value);
  },
  { deep: true, immediate: true }
);
</script>

<template>
  <DefineTemplate v-slot="{ icon, title, label, value }">
    <div
      class="flex items-center cursor-pointer rounded-10px hover:bg-#fafafa px-10px py-12px mb-10px"
    >
      <Icon :icon="icon" class="w-40px h-40px color-#aaaaaa" />
      <div class="flex-1 ml-20px">
        <div class="text-1rem font-600 color-#5d5d5d">
          {{ value ? value : title }}
        </div>
        <div class="text-10px color-#757575">{{ label }}</div>
      </div>
      <div class="flex items-center">
        <Icon
          icon="material-symbols:arrow-forward-ios-rounded"
          class="color-#545454"
        />
      </div>
    </div>
  </DefineTemplate>
  <DefineOption v-slot="{ icon, title, label, value }">
    <div
      class="flex items-center cursor-pointer rounded-10px hover:bg-#fafafa px-10px py-12px mb-10px"
    >
      <Icon :icon="icon" class="w-25px h-25px color-#aaaaaa" />
      <div class="flex-1 ml-10px">
        <div class="text-1rem font-600 color-#5d5d5d">
          {{ title }}
        </div>
        <div class="text-10px color-#757575">{{ label }}</div>
      </div>
      <div class="flex items-center color-#8c8c8c text-10px">
        {{ value }}
      </div>
    </div>
  </DefineOption>
  <div class="mt-20px">
    <div class="my-20px color-#aaaaaa">{{ t("init.select_repo") }}</div>
  </div>
  <div class="w-full">
    <ReuseTemplate
      icon="fluent-emoji:bread"
      :title="t('init.repo_name')"
      :label="t('init.repo_name_info')"
      :value="modelValue.repoName!"
      @click="repoVisible = true"
    ></ReuseTemplate>
    <ReuseTemplate
      v-show="!isEmpty(modelValue.repoName)"
      icon="fluent-emoji:crown"
      :title="t('init.branch_name')"
      :label="t('init.branch_name_info')"
      :value="modelValue.branchName!"
      @click="branchVisible = true"
    ></ReuseTemplate>
  </div>

  <n-drawer
    v-model:show="repoVisible"
    placement="bottom"
    height="80%"
    :drawer-style="{ borderRadius: '18px 18px 0 0' }"
  >
    <n-drawer-content :native-scrollbar="false">
      <div class="px-10px text-1.5rem py-10px font-bold">
        {{ t("init.select_repo") }}
      </div>
      <ReuseOption
        v-for="item in repoOptions"
        icon="fluent-emoji:bread"
        :title="item.name"
        :label="item.description ? item.description : item.name"
        :value="item.language!"
        @click="handleClickRepo(item)"
      ></ReuseOption>
    </n-drawer-content>
  </n-drawer>
  <n-drawer
    v-model:show="branchVisible"
    placement="bottom"
    height="80%"
    :drawer-style="{ borderRadius: '18px 18px 0 0' }"
  >
    <n-drawer-content :native-scrollbar="false">
      <div class="px-10px text-1.5rem py-10px font-bold">
        {{ t("init.select_branch") }}
      </div>
      <ReuseOption
        v-for="item in branchOptions"
        icon="fluent-emoji:crown"
        :title="item.name"
        @click="handleClickBranch(item)"
      ></ReuseOption>
    </n-drawer-content>
  </n-drawer>
</template>

<style lang="less" scoped>
.a {
  color: #2f2f2f;
}
</style>
