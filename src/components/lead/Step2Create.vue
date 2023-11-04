<script lang="ts" setup>
import { Octokit } from "octokit";
import { useGlobalState } from "../../store";
import { operations } from "@octokit/openapi-types";

type RepoContent =
  operations["repos/create-for-authenticated-user"]["requestBody"]["content"]["application/json"];

const { access_token } = useGlobalState();
const octokit = new Octokit({
  auth: access_token.value,
});

const form = reactive<RepoContent>({
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
  <div class="flex flex-col items-center justify-center mt-20px">
    <div class="my-20px color-#aaaaaa">创建一个新仓库!</div>
    <n-form :model="form" class="w-full" label-placement="left">
      <n-form-item label="名称" path="name">
        <n-input
          v-model:value="form.name"
          type="text"
          placeholder="新建仓库名"
        />
      </n-form-item>
      <n-form-item label="描述" path="description">
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
  </div>
</template>

<style lang="less" scoped></style>
