<script lang="ts" setup>
import { invoke } from "@tauri-apps/api";
import { UserConfig } from "../types/auth";
import { Icon } from "@iconify/vue";
import { Octokit } from "octokit";
import { components } from "@octokit/openapi-types";
import { picxStore } from "../pinia";

type Repo = components["schemas"]["repo-search-result-item"];
type Branch = components["schemas"]["short-branch"];

const active = ref(false);
const active1 = ref(false);
const searchRepo = ref("");
const state: UserConfig = await invoke("get_user_state");
const user = computed(() => state.user);
const octokit = new Octokit({ auth: state.token.access_token });
const repos = ref<Repo[]>([]);
const branchs = ref<Branch[]>([]);
const { getPicxConfig, setPicxConfig } = picxStore();

async function searchRepositories() {
  const { data } = await octokit.request("GET /search/repositories", {
    q: `user:${user.value.login}+${searchRepo.value}`,
    sort: "stars",
    per_page: 100,
  });
  repos.value = data.items;
}
async function searchBranches() {
  if (getPicxConfig?.repo) {
    const { data } = await octokit.request(
      "GET /repos/{owner}/{repo}/branches",
      {
        owner: user.value.login!,
        repo: getPicxConfig.repo,
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
  setPicxConfig({
    repo: item.name,
  });
  setPicxConfig({
    branch: "",
  });
  searchBranches();
  active.value = false;
}
function handleClickBranch(item: Branch) {
  setPicxConfig({
    branch: item.name,
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

  <div class="user-container">
    <div class="m-10px card-white">
      <div class="flex items-center">
        <div class="flex-1 flex items-center">
          <n-image width="50" :src="user.avatar_url" class="rounded-100%" />
          <div class="ml-16px">
            <div class="font-bold">{{ user.name || user.login }}</div>
            <div class="text-12px">简介: {{ user.bio }}</div>
          </div>
        </div>
        <div class="">
          <Icon icon="ri:settings-3-fill" class="text-20px" />
        </div>
      </div>

      <div class="grid grid-cols-3 mt-20px">
        <div class="text-center">
          <div class="text-14px">{{ user.public_repos }}</div>
          <div class="text-12px">仓库</div>
        </div>

        <div class="text-center">
          <div class="text-14px">{{ user.following }}</div>
          <div class="text-12px">关注</div>
        </div>

        <div class="text-center">
          <div class="text-14px">{{ user.followers }}</div>
          <div class="text-12px">被关注</div>
        </div>
      </div>
    </div>

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
          <div class="lh-34px">{{ getPicxConfig?.repo }}</div>
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
          <div class="lh-34px">{{ getPicxConfig?.branch }}</div>
          <Icon icon="ri:arrow-right-s-line" class="text-25px" />
        </div>
      </div>

      <div></div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.card {
  // box-shadow: 0 0 8px 8px #f3f3f3;
  padding: 14px 16px;
  background-color: var(--color-primary);
  color: white;
}

.card-white {
  box-shadow: 0 0 8px 8px #f3f3f3;
  padding: 12px 16px;
  background-color: white;
  color: var(--color-primary);
  border-radius: 10px;
  cursor: pointer;
}

.card-white-no-shadow {
  // box-shadow: 0 0 8px 8px #f3f3f3;
  padding: 12px 16px;
  background-color: #f5f9ff;
  color: var(--color-primary);
  border-radius: 10px;
  cursor: pointer;
  margin-bottom: 10px;
}
</style>
