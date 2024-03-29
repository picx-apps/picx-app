<script lang="ts" setup>
import { Repository, useGlobalState } from "../store";
import type { BranchInfo, RepoInfo } from "../types";
import { Icon } from "@iconify/vue";
import SystemUiconsSearch from "~icons/system-uicons/search";
import { isEmpty } from "lodash-es";
import { Octokit } from "octokit";

const props = defineProps<{
  modelValue: Repository;
  to?: string | HTMLElement;
}>();
const emit = defineEmits(["update:modelValue"]);
const modelValue = useVModel(props, "modelValue", emit);
const { access_token, user } = useGlobalState();
const repoOptions = ref<RepoInfo[]>([]);
const branchOptions = useStorage<BranchInfo[]>("branch_options", []);
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
const search_name = ref("");
const loading = ref(false);

async function initRepo() {
  loading.value = true;
  const { data } = await octokit.request("GET /search/repositories", {
    q: `${search_name.value}+user:${user.value?.login}+`,
    sort: "stars",
    per_page: 100,
  });
  loading.value = false;
  repoOptions.value = data.items;
}
watchDebounced(
  search_name,
  () => {
    initRepo();
  },
  { debounce: 800 },
);
async function initBranches() {
  if (modelValue.value.repo_name) {
    const { data } = await octokit.request("GET /repos/{owner}/{repo}/branches", {
      owner: user.value?.login!,
      repo: modelValue.value.repo_name,
    });
    branchOptions.value = data;
  }
}
function handleClickRepo(item: RepoInfo) {
  modelValue.value.repo_name = item.name;
  modelValue.value.branch_name = item.default_branch;
  repoVisible.value = false;
  initBranches();
}
function handleClickBranch(item: BranchInfo) {
  modelValue.value.branch_name = item.name;
  branchVisible.value = false;
}

onMounted(() => {
  initRepo();
});
</script>

<template>
  <DefineTemplate v-slot="{ icon, title, label, value }">
    <div
      class="flex items-center cursor-pointer rounded-10px hover:bg-#fafafa dark:hover:bg-gray-7 px-10px py-12px mb-10px"
    >
      <Icon :icon="icon" class="w-40px h-40px color-#aaaaaa" />
      <div class="flex-1 ml-20px">
        <div class="text-1rem font-600 color-#5d5d5d dark:color-white">
          {{ value ? value : title }}
        </div>
        <div class="text-10px color-#757575">{{ label }}</div>
      </div>
      <div class="flex items-center">
        <Icon icon="material-symbols:arrow-forward-ios-rounded" class="color-#545454" />
      </div>
    </div>
  </DefineTemplate>
  <DefineOption v-slot="{ icon, title, label, value }">
    <div
      class="flex items-center cursor-pointer rounded-10px hover:bg-#fafafa dark:hover:bg-gray-7 px-10px py-12px mb-10px"
    >
      <Icon :icon="icon" class="w-25px h-25px color-#aaaaaa" />
      <div class="flex-1 ml-10px">
        <div class="text-1rem font-600 color-#5d5d5d dark:color-white">
          {{ title }}
        </div>
        <div class="text-10px color-#757575">{{ label }}</div>
      </div>
      <div class="flex items-center color-#8c8c8c text-10px">
        {{ value }}
      </div>
    </div>
  </DefineOption>

  <div class="w-full">
    <ReuseTemplate
      icon="fluent-emoji:bread"
      :title="t('init.repo_name')"
      :label="t('init.repo_name_info')"
      :value="modelValue.repo_name!"
      @click="repoVisible = true"
    ></ReuseTemplate>
    <ReuseTemplate
      v-show="!isEmpty(modelValue.repo_name)"
      icon="fluent-emoji:crown"
      :title="t('init.branch_name')"
      :label="t('init.branch_name_info')"
      :value="modelValue.branch_name!"
      @click="branchVisible = true"
    ></ReuseTemplate>
  </div>

  <n-drawer
    v-model:show="repoVisible"
    placement="bottom"
    height="80%"
    :style="{ borderRadius: '18px 18px 0 0' }"
    :to="to"
  >
    <n-drawer-content :native-scrollbar="false">
      <div class="px-10px text-1.5rem py-10px font-bold">
        {{ t("init.select_repo") }}
      </div>
      <n-input
        round
        v-model:value="search_name"
        :placeholder="t('init.select_repo')"
        :loading="loading"
        @change="initRepo"
        class="mb-10px"
      >
        <template #prefix>
          <n-icon :component="SystemUiconsSearch" />
        </template>
      </n-input>
      <ReuseOption
        v-for="item in repoOptions"
        :key="item.id"
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
    :style="{ borderRadius: '18px 18px 0 0' }"
    :to="to"
  >
    <n-drawer-content :native-scrollbar="false">
      <div class="px-10px text-1.5rem py-10px font-bold">
        {{ t("init.select_branch") }}
      </div>
      <ReuseOption
        v-for="item in branchOptions"
        :key="item.name"
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
