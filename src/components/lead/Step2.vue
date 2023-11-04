<script lang="ts" setup>
import type { LeadConfig } from "../../types";
import { Octokit } from "octokit";
import { useGlobalState } from "../../store";
import { components } from "@octokit/openapi-types";

type Repo = components["schemas"]["repo-search-result-item"];
type Branch = components["schemas"]["short-branch"];

const icon = {
  yes: "icon-park-solid:grinning-face-with-squinting-eyes",
  no: "icon-park-solid:grinning-face-with-tightly-closed-eyes-open-mouth",
};
const props = defineProps<{
  modelValue: LeadConfig;
}>();
const emit = defineEmits(["update:modelValue"]);
const modelValue = useVModel(props, "modelValue", emit);
const { access_token, user } = useGlobalState();
const repoOptions = ref<Repo[]>([]);
const branchOptions = ref<Branch[]>([]);
const octokit = new Octokit({ auth: access_token.value });
const repoVisible = ref(false);
const branchVisible = ref(false);

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
function handleClickRepo(item: Repo) {
  modelValue.value.repoName = item.name;
  modelValue.value.branchName = item.default_branch;
  repoVisible.value = false;
  initBranches();
}
function handleClickBranch(item: Branch) {
  modelValue.value.branchName = item.name;
  branchVisible.value = false;
}

onMounted(() => {
  initRepo();
});
</script>

<template>
  <div class="flex flex-col items-center justify-center mt-20px">
    <div class="my-20px color-#aaaaaa">选择你的仓库!</div>
    <CellGroup>
      <Cell
        icon="ic:sharp-home"
        title="仓库"
        label="浏览你的所有仓库"
        :value="modelValue.repoName"
        is-link
        :link-icon="modelValue.repoName ? icon.yes : icon.no"
        style="--cell-link-icon-size: 24px"
        :style="{
          '--cell-link-icon-color': modelValue.repoName ? '#ffb939' : '#aaaaaa',
        }"
        @click="repoVisible = true"
      />
      <Cell
        v-show="modelValue.repoName"
        icon="mingcute:git-branch-fill"
        title="分支"
        label="浏览当前仓库分支"
        :value="modelValue.branchName"
        is-link
        :link-icon="modelValue.branchName ? icon.yes : icon.no"
        style="--cell-link-icon-size: 24px"
        :style="{
          '--cell-link-icon-color': modelValue.branchName
            ? '#ffb939'
            : '#aaaaaa',
        }"
        @click="branchVisible = true"
      />
    </CellGroup>
  </div>

  <n-drawer
    v-model:show="repoVisible"
    placement="bottom"
    height="80%"
    :drawer-style="{ borderRadius: '18px 18px 0 0' }"
  >
    <n-drawer-content title="选择仓库" :native-scrollbar="false">
      <Cell
        v-for="item in repoOptions"
        @click="handleClickRepo(item)"
        :icon="modelValue.repoName === item.name ? icon.yes : icon.no"
        :title="item.name"
        :label="item.description ? item.description : item.name"
        :value="item.language"
        style="
          --cell-value-size: 12px;
          --cell-icon-size: 20px;
          border-radius: 8px;
        "
        :style="{
          '--cell-icon-color':
            modelValue.repoName === item.name ? '#ffb939' : '#aaaaaa',
        }"
      />
    </n-drawer-content>
  </n-drawer>
  <n-drawer
    v-model:show="branchVisible"
    placement="bottom"
    height="80%"
    :drawer-style="{ borderRadius: '18px 18px 0 0' }"
  >
    <n-drawer-content title="选择分支" :native-scrollbar="false">
      <Cell
        v-for="item in branchOptions"
        @click="handleClickBranch(item)"
        :icon="modelValue.branchName === item.name ? icon.yes : icon.no"
        :title="item.name"
        style="
          --cell-icon-size: 20px;
          --cell-title-size: 18px;
          border-radius: 8px;
        "
        :style="{
          '--cell-icon-color':
            modelValue.branchName === item.name ? '#ffb939' : '#aaaaaa',
        }"
      />
    </n-drawer-content>
  </n-drawer>
</template>

<style lang="less" scoped></style>
