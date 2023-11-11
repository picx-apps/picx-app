<script lang="ts" setup>
import { Icon } from "@iconify/vue";
import { open } from "@tauri-apps/api/dialog";
import { useUploadState } from "../store/upload";
import { cloneDeepWith } from "lodash-es";
import type { UploadContent } from "../types/upload";
import { invoke } from "@tauri-apps/api";
import { useGlobalState } from "../store";

const tempContents = ref<UploadContent[]>([]);
const waitContents = ref<UploadContent[]>([]);
const { currentPath, currentDirs, addUploadPath, removeUploadPath } =
  useUploadState();
const { compress } = useGlobalState();
const showSelectDir = ref(false);
const message = useMessage();
const { t } = useI18n();

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
    console.time("compress time");
    const {
      buffer,
      base64,
      compression_buffer,
      compression_base64,
    }: {
      buffer: Uint8Array;
      base64: string;
      compression_buffer: Uint8Array;
      compression_base64: string;
    } = await invoke("compression_image", {
      path,
      compressionQuality: compress.value.enable
        ? compress.value.compress_type
        : undefined,
    });
    console.timeEnd("compress time");
    let filename = path.split("/").pop() as string;
    const random: string = await invoke("rand_string");
    const _filename = filename.split(".");
    filename =
      _filename.length > 1
        ? `${_filename[0]}_${random}.${_filename[1]}`
        : filename + random;

    tempContents.value.push({
      path: filename,
      content: base64,
      size: buffer.length,
      compression_size: compression_buffer.length,
      compression_content: compression_base64,
    });
  }
}
async function handleAfterLeave() {
  tempContents.value = [];
}
//加入上传队列
function handleQueue() {
  //等待上传队列
  waitContents.value.push(
    ...cloneDeepWith(
      tempContents.value.map((item) => ({
        ...item,
        dir: currentPath.value,
      }))
    )
  );
  showSelectDir.value = false;
}
//上传
async function handleUpload() {
  const contents = waitContents.value.map((item) => ({
    ...item,
    path: item.dir + "/" + item.path,
  }));
  const res = await uploadFilesToGitHub(contents);
  if (res?.status === 201) {
    message.warning("上传成功");
    waitContents.value = [];
  }
}
//立即上传
async function handleBeginUpload() {
  //等待上传队列
  waitContents.value.push(
    ...cloneDeepWith(
      tempContents.value.map((item) => ({
        ...item,
        dir: currentPath.value,
      }))
    )
  );
  showSelectDir.value = false;
  handleUpload();
}
</script>

<route lang="yaml">
name: upload
</route>

<template>
  <n-scrollbar style="height: 100vh">
    <Header>
      {{ t("node.title") }}
      <template #optional>
        <Icon
          @click="handleClickUpload"
          icon="majesticons:camera"
          class="text-1.6rem cursor-pointer"
        />
      </template>
    </Header>

    <div class="px-16px pt-16px">
      <div v-if="!waitContents.length">
        <div class="text-center mt-0px">
          <Icon icon="fluent-emoji:astronaut-light" class="w-300px h-300px" />

          <div class="text-1.2rem font-bold color-gray-7">
            {{ t("node.info") }}
          </div>
        </div>
      </div>

      <div v-else>
        <div
          class="text-1.1rem font-bold color-gray-8 mb-20px flex items-center"
        >
          <Icon icon="ph:circle-notch-bold" />
          <span class="ml-10px">
            {{ t("node.wait_upload_number", { number: waitContents.length }) }}
          </span>
        </div>
        <ImageCard
          v-for="(item, index) in waitContents"
          :key="item.path"
          v-bind="item"
          @delete="() => waitContents.splice(index, 1)"
        />
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
          @click="() => (showSelectDir = false)"
          icon="material-symbols:close"
          class="float-right text-1.2rem cursor-pointer hover:color-primary-400 select-none"
        />

        <div class="my-20px">
          <div class="text-1.1rem font-bold flex items-center">
            {{ t("path") }}: {{ currentPath ? currentPath : "Root" }}
          </div>
        </div>

        <n-scrollbar class="h[calc(100%-140px)]">
          <CellGroup>
            <div>
              <span
                class="cursor-pointer hover:color-primary-400"
                @click="removeUploadPath(currentPath)"
                >{{ t("back") }}</span
              >
            </div>
            <template v-if="currentDirs.length">
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
                  <Icon
                    icon="ic:round-folder"
                    class="text-3rem color-primary-400 mr-10px"
                  />
                </template>
              </Cell>
            </template>

            <Cell
              v-else
              title="Empty"
              style="--cell-padding-x: 0; --cell-bg-color-hover: white"
            >
              <template #prefix>
                <Icon
                  icon="ic:round-folder-open"
                  class="text-3rem color-primary-100 mr-10px"
                />
              </template>
            </Cell>
          </CellGroup>
        </n-scrollbar>

        <div class="w-full text-center">
          <n-button type="primary" ghost class="mr-10px" @click="handleQueue">{{
            t("node.button.queue")
          }}</n-button>
          <n-button type="primary" @click="handleBeginUpload">{{
            t("node.button.immediately")
          }}</n-button>
        </div>
      </n-drawer-content>
    </n-drawer>

    <Tabbar />
  </n-scrollbar>
  <div
    class="text-center fixed bottom-100px w-full"
    v-show="waitContents.length"
  >
    <n-button type="primary" @click="handleUpload">{{
      t("node.button.upload")
    }}</n-button>
  </div>
</template>

<style lang="less" scoped></style>
