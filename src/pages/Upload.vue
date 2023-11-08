<script lang="ts" setup>
import { Icon } from "@iconify/vue";
import { open } from "@tauri-apps/api/dialog";
import { useUploadState } from "../store/upload";
import dirSvg from "../assets/images/dir.png?url";
import { cloneDeepWith } from "lodash-es";
import type { UploadContent } from "../types/upload";
import { invoke } from "@tauri-apps/api";
import { CompressionQuality } from "../enum";

const tempContents = ref<UploadContent[]>([]);
const waitContents = ref<UploadContent[]>([]);
const { currentPath, currentDirs, addUploadPath, removeUploadPath } =
  useUploadState();
const showSelectDir = ref(false);
const message = useMessage();

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
    console.time("bbb");
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
      compressionQuality: CompressionQuality.Default,
    });
    console.timeEnd("bbb");
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
  <n-scrollbar class="px-16px" style="height: 100vh">
    <!-- <Header>
      <template #optional>
        <Icon
          @click="handleClickUpload"
          icon="majesticons:camera"
          class="text-1.6rem cursor-pointer color-#5448ee"
        />
      </template>
    </Header> -->
    <div class="flex py-10px">
      <div class="flex-1"></div>
      <div>
        <Icon
          @click="handleClickUpload"
          icon="majesticons:camera"
          class="text-1.6rem cursor-pointer color-#5448ee select-none"
        />
      </div>
    </div>

    <div v-if="!waitContents.length">
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

    <div v-else>
      <div class="text-1.1rem font-bold color-#5448ee mb-20px">
        <Icon icon="ph:circle-notch-bold" /> 待上传 {{ waitContents.length }} 张
      </div>
      <ImageCard
        v-for="(item, index) in waitContents"
        :key="item.path"
        v-bind="item"
        @delete="() => waitContents.splice(index, 1)"
      />
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
          class="float-right text-1.2rem cursor-pointer hover:color-#487aef select-none"
        />

        <div class="my-20px">
          <div class="text-1.1rem font-bold flex items-center">
            上传路径: {{ currentPath ? currentPath : "/" }}
          </div>
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
                  <img :src="dirSvg" class="w-35px mr-10px" />
                </template>
              </Cell>
            </template>
            <div
              v-else
              class="flex flex-col items-center justify-center color-#aaaaaa mt-20px"
            >
              <Icon icon="octicon:file-directory-fill-24" class="text-3rem" />
              <div>无下级目录</div>
            </div>
          </CellGroup>
        </n-scrollbar>

        <div class="w-full text-center">
          <n-button type="primary" ghost class="mr-10px" @click="handleQueue"
            >加入队列</n-button
          >
          <n-button type="primary" @click="handleBeginUpload"
            >立即上传</n-button
          >
        </div>
      </n-drawer-content>
    </n-drawer>

    <Tabbar />
  </n-scrollbar>
  <div
    class="text-center fixed bottom-100px w-full"
    v-show="waitContents.length"
  >
    <n-button type="primary" ghost @click="handleUpload">立即上传</n-button>
  </div>
</template>

<style lang="less" scoped>
.a {
  color: #8c8c8c;
}
</style>
