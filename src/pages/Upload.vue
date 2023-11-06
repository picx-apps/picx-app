<script lang="ts" setup>
import { Icon } from "@iconify/vue";
import { open } from "@tauri-apps/api/dialog";
import { useUploadState } from "../store/upload";
import dirSvg from "../assets/images/dir.png?url";
import { cloneDeepWith } from "lodash-es";
import type { UploadContent } from "../types/upload";
import { readBinaryFile } from "@tauri-apps/api/fs";

const tempContents = ref<UploadContent[]>([]);
const waitContents = ref<UploadContent[]>([]);
const { currentPath, currentDirs, addUploadPath, removeUploadPath } =
  useUploadState();
const showSelectDir = ref(false);
const contents = computed({
  get(): UploadContent[] {
    return waitContents.value.map((item) => ({
      path: currentPath.value + "/" + item.path,
      content: item.content,
    }));
  },
  set(value: UploadContent[]) {
    waitContents.value = value;
  },
});

async function handleClickUpload() {
  const selected = (await open({
    multiple: true,
    filters: [
      {
        name: "Image",
        extensions: ["png", "jpeg", "jpg"],
      },
    ],
  })) as string[];
  if (!selected) return;
  await handleImages(selected);
  showSelectDir.value = true;
}
async function handleImages(paths: string[]) {
  for (const path of paths) {
    const binary = await readBinaryFile(path);
    const base64 = btoa(String.fromCharCode.apply(null, [...binary]));
    const filename = path.split("/").pop() as string;
    tempContents.value.push({ path: filename, content: base64 });
  }
}
async function handleAfterLeave() {
  tempContents.value = [];
  const data = await uploadFilesToGitHub(contents.value);
  console.log("upload", data);
  debugger;
}
function handleQueue() {
  contents.value = cloneDeepWith(tempContents.value);
  showSelectDir.value = false;
}
</script>

<route lang="yaml">
name: upload
</route>

<template>
  <n-scrollbar style="height: 100vh">
    <Header>
      <template #optional>
        <Icon
          @click="handleClickUpload"
          icon="majesticons:camera"
          class="text-1.6rem cursor-pointer color-#5448ee"
        />
      </template>
    </Header>

    <div>
      <div class="text-center mt-0px">
        <n-image
          src="src/assets/images/camera.png"
          width="200"
          preview-disabled
        />
        <div class="text-1.2rem font-bold color-#525252">
          上传你的第一张照片
        </div>
      </div>
    </div>

    <n-drawer
      v-model:show="showSelectDir"
      placement="bottom"
      height="80vh"
      :drawer-style="{ borderRadius: '18px 18px 0 0' }"
      @after-leave="handleAfterLeave"
    >
      <n-drawer-content>
        <Icon
          icon="material-symbols:close"
          class="float-right text-1.2rem cursor-pointer hover:color-#487aef select-none"
        />

        <div class="my-20px">
          <div class="text-1.1rem font-bold">
            {{ currentPath ? currentPath : "/" }}
          </div>
          <div class="color-#8c8c8c text-12px">选择上传路径</div>
        </div>

        <n-scrollbar class="h[calc(100%-140px)]">
          <CellGroup>
            <Cell
              title="返回上一级"
              icon="ion:arrow-undo-sharp"
              @click="
                () => {
                  removeUploadPath(currentPath);
                }
              "
              style="
                --cell-padding-x: 0;
                --cell-bg-color-hover: white;
                align-items: end;
                --cell-icon-color: #6498ff;
              "
            />
            <Cell
              v-for="item in currentDirs"
              :key="item.sha"
              :title="item.name"
              is-link
              @click="
                () => {
                  addUploadPath(item.path);
                }
              "
              style="--cell-padding-x: 0; --cell-bg-color-hover: white"
            >
              <template #prefix>
                <img :src="dirSvg" class="w-35px mr-10px" />
              </template>
            </Cell>
          </CellGroup>
        </n-scrollbar>

        <div class="w-full text-center">
          <n-button type="primary" ghost class="mr-10px" @click="handleQueue"
            >加入队列</n-button
          >
          <n-button type="primary">立即上传</n-button>
        </div>
      </n-drawer-content>
    </n-drawer>

    <Tabbar />
  </n-scrollbar>
</template>

<style lang="less" scoped>
.a {
  color: #8c8c8c;
}
</style>
