<script lang="ts" setup>
import { Octokit } from "octokit";
import { useGlobalState } from "../../store";
import { CreateRepoContents } from "../../types";
import { Icon } from "@iconify/vue";

const { access_token } = useGlobalState();
const octokit = new Octokit({
  auth: access_token.value,
});

const form = reactive<CreateRepoContents>({
  name: "Picx-app",
  description: "Hello, Welcome to Picx!",
});

async function createRepo() {
  const data = await octokit.request("POST /user/repos", {
    name: form.name,
    description: form.description,
    headers: {
      accept: "application/vnd.github+json",
    },
  });
  return data;
}

defineExpose({
  createRepo,
});
</script>

<template>
  <div class="mt-20px">
    <div class="my-20px color-#aaaaaa">Create a new warehouse!</div>
  </div>
  <n-form :model="form" class="w-full" label-width="50" label-placement="top">
    <n-form-item label="Name" path="name">
      <template #label>
        <div class="flex items-center">
          <span>Name</span>
          <Icon
            icon="fluent-emoji:carrot"
            class="w-30px h-30px color-#aaaaaa"
          />
        </div>
      </template>
      <n-input v-model:value="form.name" type="text" placeholder="新建仓库名" />
    </n-form-item>
    <n-form-item label="Desc" path="description">
      <template #label>
        <div class="flex items-center">
          <span>Desc</span>
          <Icon
            icon="fluent-emoji:feather"
            class="w-30px h-30px color-#aaaaaa"
          />
        </div>
      </template>
      <n-input
        v-model:value="form.description"
        type="textarea"
        :autosize="{
          minRows: 4,
          maxRows: 4,
        }"
        show-count
        placeholder="仓库描述"
      />
    </n-form-item>
  </n-form>
</template>

<style lang="less" scoped></style>
