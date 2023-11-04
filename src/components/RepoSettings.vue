<script lang="ts" setup>
import { Icon } from "@iconify/vue";
import { Octokit } from "octokit";
import { components } from "@octokit/openapi-types";
import { useGlobalState } from "../store";

type Repo = components["schemas"]["repo-search-result-item"];
type Branch = components["schemas"]["short-branch"];

const active = ref(false);
const active1 = ref(false);
const searchRepo = ref("");
const repos = ref<Repo[]>([]);
const branchs = ref<Branch[]>([]);
const { repo_name, branch_name, user, access_token, set_repository } =
  useGlobalState();
const octokit = new Octokit({ auth: access_token.value });

async function searchRepositories() {
  const { data } = await octokit.request("GET /search/repositories", {
    q: `user:${user.value?.login}+${searchRepo.value}`,
    sort: "stars",
    per_page: 100,
  });
  repos.value = data.items;
}
async function searchBranches() {
  if (repo_name.value) {
    const { data } = await octokit.request(
      "GET /repos/{owner}/{repo}/branches",
      {
        owner: user.value?.login!,
        repo: repo_name.value,
      }
    );
    branchs.value = data;
  }
}
async function init() {
  await searchRepositories();
  await searchBranches();
}
function handleClickRepo(item: Repo) {
  branchs.value = [];
  set_repository({
    repo_name: item.name,
  });
  set_repository({
    branch_name: "",
  });
  searchBranches();
  active.value = false;
}
function handleClickBranch(item: Branch) {
  set_repository({
    branch_name: item.name,
  });
  active1.value = false;
}

onMounted(() => {
  init();
});
</script>

<template>
  <n-drawer
    v-model:show="active"
    placement="bottom"
    height="80%"
    :drawer-style="{ borderRadius: '18px' }"
  >
    <n-drawer-content
      :native-scrollbar="false"
      :header-style="{ padding: '10px 24px', display: 'block', border: 0 }"
    >
      <template #header>
        <n-input
          v-model:value="searchRepo"
          placeholder="仓库名称"
          class="w-100%"
          @change="() => searchRepositories()"
        ></n-input>
      </template>
      <div class="mt-10px">
        <div
          class="card-white-no-shadow"
          v-for="item in repos"
          :key="item.id"
          @click="handleClickRepo(item)"
        >
          <div class="flex items-center">
            <Icon icon="ri:git-repository-line" class="text-gray" />
            <span class="text-#6b6b6b ml-6px"> {{ item.name }} </span>
          </div>
        </div>
      </div>
    </n-drawer-content>
  </n-drawer>

  <n-drawer
    v-model:show="active1"
    placement="bottom"
    height="80%"
    :drawer-style="{ borderRadius: '18px' }"
  >
    <n-drawer-content :native-scrollbar="false">
      <div class="mt-10px">
        <div
          class="card-white-no-shadow"
          v-for="item in branchs"
          :key="item.name"
          @click="handleClickBranch(item)"
        >
          <div class="flex items-center">
            <Icon icon="ri:git-repository-line" class="text-gray" />
            <span class="text-#6b6b6b ml-6px"> {{ item.name }} </span>
          </div>
        </div>
      </div>
    </n-drawer-content>
  </n-drawer>

  <div class="m-10px card-white">
    <div
      class="flex items-center justify-between mb-14px"
      @click="() => (active = true)"
    >
      <div class="flex items-center">
        <Icon icon="ri:git-repository-line" class="text-20px"></Icon>
        <div class="ml-10px lh-34px">当前仓库</div>
      </div>
      <div class="flex items-center">
        <div class="lh-34px">{{ repo_name }}</div>
        <Icon icon="ri:arrow-right-s-line" class="text-25px" />
      </div>
    </div>

    <div
      class="flex items-center justify-between"
      @click="() => (active1 = true)"
    >
      <div class="flex items-center">
        <Icon icon="ri:git-branch-fill" class="text-20px"></Icon>
        <div class="ml-10px lh-34px">当前分支</div>
      </div>
      <div class="flex items-center">
        <div class="lh-34px">{{ branch_name }}</div>
        <Icon icon="ri:arrow-right-s-line" class="text-25px" />
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.card-white {
  box-shadow: 0 0 8px 8px #f3f3f3;
  padding: 12px 16px;
  background-color: white;
  color: var(--text-primary);
  border-radius: 10px;
  cursor: pointer;
}

.card-white-no-shadow {
  // box-shadow: 0 0 8px 8px #f3f3f3;
  padding: 12px 16px;
  background-color: #f5f9ff;
  color: var(--text-primary);
  border-radius: 10px;
  cursor: pointer;
  margin-bottom: 10px;
}
</style>
