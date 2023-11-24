<script lang="ts" setup>
import { Icon } from "@iconify/vue";
import { useGlobalState } from "~/store";
import { useSettingState } from "~/store/setting";
import { RepoContents } from "~/types";
import { isArray } from "lodash-es";
import { NInput } from "naive-ui";

const [DefineLibrary, ReusableLibrary] = createReusableTemplate<{
  icon?: string;
  text?: string;
}>();

const { t } = useI18n();
const { user, octokit, repo_name, branch_name } = useGlobalState();
const { settings } = useSettingState();
const imagePath = ref<string[]>([]);
const contents = ref<RepoContents>([]);
const [library] = useRepoContent(contents);
const currentPath = computed(() => imagePath.value[imagePath.value.length - 1] || "");
const inputInstance = ref<InstanceType<typeof NInput>>();
const [newLibrary, resetNewLibrary] = useResetRef({
  enable: false,
  name: "",
  loading: false,
});

async function syncContents() {
  const res = await octokit.value.request("GET /repos/{owner}/{repo}/contents/{path}", {
    owner: user.value?.login!,
    repo: repo_name.value,
    ref: branch_name.value,
    path: currentPath.value,
    t: now.value,
  });
  if (res.status === 200) {
    const data = isArray(res.data) ? res.data : [res.data];
    //排除配置文件中已删除的
    contents.value = data.filter((item) => !settings.value.recycleBin[item.path]);
  }
}
watch(
  [now, currentPath],
  () => {
    syncContents();
  },
  { immediate: true },
);
async function createLibrary(name: string) {
  if (!name) return;
  const path = (currentPath.value ? `${currentPath.value}/` : currentPath.value) + name;
  const res = await useCreateFolder(path);
  if (res?.status === 201) {
    await syncContents();
    updateNow();
    return true;
  }
  return false;
}
function addImagePath(value: string) {
  imagePath.value.push(value);
}
function handleNewLibrary() {
  if (newLibrary.value.enable) return;
  newLibrary.value.enable = true;
  nextTick(() => {
    inputInstance.value?.focus();
  });
}
async function handleConfirmLibrary() {
  if (!newLibrary.value.name) {
    resetNewLibrary();
    return;
  }
  newLibrary.value.loading = true;
  await createLibrary(newLibrary.value.name);
  resetNewLibrary();
}
</script>

<template>
  <DefineLibrary v-slot="{ $slots, text, icon }">
    <div class="flex flex-col items-center p-8px rounded-8px cursor-pointer group select-none">
      <Icon :icon="icon ? icon : 'ic:round-folder'" class="text-4rem color-blue-400" />
      <template v-if="$slots.default">
        <component :is="$slots.default" />
      </template>
      <div v-else class="text-11px text-center lh-12px color-#989898 group-hover:color-white text">{{ text }}</div>
    </div>
  </DefineLibrary>

  <div>
    <div class="flex items-center text-1rem color-gray">
      <div flex-1>
        <span font-bold>{{ currentPath ? currentPath : t("root") }}</span>
      </div>
      <div class="flex items-center">
        <n-tooltip placement="top" trigger="hover" v-if="imagePath.length">
          <template #trigger>
            <Icon
              icon="ph:arrow-left-bold"
              class="text-1.3rem mr-10px hover:color-white cursor-pointer"
              @click="() => imagePath.pop()"
            />
          </template>
          <span> {{ t("back") }} </span>
        </n-tooltip>
        <n-tooltip placement="top" trigger="hover">
          <template #trigger>
            <Icon icon="ph:plus-bold" class="text-1.3rem hover:color-white cursor-pointer" @click="handleNewLibrary" />
          </template>
          <span> {{ t("home.new") }} </span>
        </n-tooltip>
      </div>
    </div>

    <n-scrollbar class="h-210px" v-if="library.length">
      <div class="grid grid-cols-4 gap-10px">
        <ReusableLibrary v-if="newLibrary.enable">
          <n-input
            v-model:value="newLibrary.name"
            ref="inputInstance"
            size="tiny"
            placeholder=""
            autofocus
            :loading="newLibrary.loading"
            :disabled="newLibrary.loading"
            @change="handleConfirmLibrary"
            @blur="handleConfirmLibrary"
          />
        </ReusableLibrary>

        <ReusableLibrary v-for="item in library" :key="item.sha" :text="item.name" @click="addImagePath(item.path)" />
      </div>
    </n-scrollbar>
    <div v-else class="p-8px color-gray text-center">{{ t("home.library_empty") }}</div>
  </div>
</template>

<style lang="less" scoped>
.text {
  word-break: break-all;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}
</style>
