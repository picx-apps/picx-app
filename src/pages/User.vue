<script lang="ts" setup>
import { invoke } from "@tauri-apps/api";
import { UserConfig } from "../types/auth";
import { Icon } from "@iconify/vue";

const state: UserConfig = await invoke("get_user_state");
const user = computed(() => state.user);
console.log(user.value);
</script>

<template>
  <div class="user-container">
    <div class="m-10px rounded-10px card-white">
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

    <div class="m-10px rounded-10px card-white">
      <div class="flex items-center justify-between mb-14px">
        <div class="flex items-center">
          <Icon icon="ri:git-repository-line" class="text-20px"></Icon>
          <div class="ml-10px lh-34px">当前仓库</div>
        </div>
        <div class="flex items-center">
          <div class="lh-34px">current rep</div>
          <Icon icon="ri:arrow-right-s-line" class="text-25px" />
        </div>
      </div>

      <div class="flex items-center justify-between">
        <div class="flex items-center">
          <Icon icon="ri:git-branch-fill" class="text-20px"></Icon>
          <div class="ml-10px lh-34px">当前分支</div>
        </div>
        <div class="flex items-center">
          <div class="lh-34px">master</div>
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
  cursor: pointer;
}
</style>
