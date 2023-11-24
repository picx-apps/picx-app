<script lang="ts" setup>
import { Icon } from "@iconify/vue";
import { useGlobalState } from "~/store";
import { useSettingState } from "~/store/setting";
import { RepoContents } from "~/types";
import { isArray } from "lodash-es";

const repoContent = ref<RepoContents>([]);
const [dirs] = useRepoContent(repoContent);
const { settings } = useSettingState();
const { user, octokit, repo_name, branch_name, imagePaths } = useGlobalState();
const path = computed(() => (imagePaths.value.length > 0 ? imagePaths.value[imagePaths.value.length - 1] : ""));
const [DefineFolder, ReusableFolder] = createReusableTemplate<{
  icon?: string;
  text: string;
}>();

async function contents() {
  const res = await octokit.value.request("GET /repos/{owner}/{repo}/contents/{path}", {
    owner: user.value?.login!,
    repo: repo_name.value,
    ref: branch_name.value,
    path: path.value,
    t: now.value,
  });
  if (res.status === 200) {
    const data = isArray(res.data) ? res.data : [res.data];
    repoContent.value = data.filter((item) => !settings.value.recycleBin[item.path]);
  }
}
watch(
  now,
  () => {
    contents();
  },
  { immediate: true },
);
</script>

<template>
  <div>
    <Option icon="ph:circles-four-fill" text="图库夹">
      <template #optional>
        <n-tooltip placement="top" trigger="hover">
          <template #trigger>
            <Icon icon="ph:arrow-left-bold" class="text-1.3rem mr-10px hover:color-white" />
          </template>
          <span> Back </span>
        </n-tooltip>
        <n-tooltip placement="top" trigger="hover">
          <template #trigger>
            <Icon icon="ph:plus-bold" class="text-1.3rem hover:color-white" />
          </template>
          <span> New </span>
        </n-tooltip>
      </template>
    </Option>

    <DefineFolder v-slot="{ text, icon }">
      <div class="flex items-center p-8px rounded-8px cursor-pointer group">
        <Icon :icon="icon ? icon : 'ic:round-folder'" class="text-2rem color-blue-400" />
        <div class="ml-10px color-#545454 group-hover:color-white">{{ text }}</div>
      </div>
    </DefineFolder>

    <ReusableFolder icon="ph:star-duotone" text="Root" />
    <ReusableFolder v-for="item in dirs" :key="item.sha" :text="item.name" />
  </div>
</template>

<style lang="less" scoped></style>
