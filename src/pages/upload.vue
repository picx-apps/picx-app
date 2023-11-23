<script lang="ts" setup>
import { useGlobalState } from "../store";
import { useUploadState } from "../store/upload";
import type { UploadContent } from "../types/upload";
import { Icon } from "@iconify/vue";
import { invoke } from "@tauri-apps/api";
import { open } from "@tauri-apps/api/dialog";
import { useSettingState } from "~/store/setting";
import LineMdLoadingLoop from "~icons/line-md/loading-loop";
import SystemUiconsUpload from "~icons/system-uicons/upload";
import { cloneDeepWith } from "lodash-es";
import { NInput } from "naive-ui";

const tempContents = ref<UploadContent[]>([]);
const waitContents = ref<UploadContent[]>([]);
const { currentPath, currentDirs, addUploadPath, removeUploadPath, updateDirs } = useUploadState();
const { settings } = useSettingState();
const { compress } = useGlobalState();
const showSelectDir = ref(false);
const message = useMessage();
const { t } = useI18n();
const enableFolder = ref(false);
const folderName = ref("");
const [DefineTemplate, ReusableTemplate] = createReusableTemplate<{
  icon: string;
  iconColor?: string;
  label?: string;
  isLink: boolean;
}>();
const folderNameInput = ref<InstanceType<typeof NInput>>();
const uploading = ref(false);

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
  const watermark_setting = settings.value.watermark;
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
      compressionQuality: compress.value.enable ? compress.value.compress_type : undefined,
    });
    let watermark_image: string = "";
    if (watermark_setting.enable) {
      const image: string = await invoke("watermark_image", {
        image: compression_buffer,
        options: {
          text: watermark_setting.text,
          top: watermark_setting.top,
          left: watermark_setting.left,
          size: watermark_setting.size,
          font_color: watermark_setting.fontColor,
        },
      });
      watermark_image = image;
    }

    console.timeEnd("compress time");
    let filename = path.split("/").pop() as string;
    const random: string = await invoke("rand_string");
    const _filename = filename.split(".");
    filename = _filename.length > 1 ? `${_filename[0]}_${random}.${_filename.pop()}` : `${filename}_${random}`;

    tempContents.value.push({
      path: filename,
      content: base64,
      size: buffer.length,
      compression_size: compression_buffer.length,
      compression_content: watermark_image ? watermark_image : compression_base64,
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
      })),
    ),
  );
  showSelectDir.value = false;
}
//上传
async function handleUpload() {
  uploading.value = true;
  const contents = waitContents.value.map((item) => ({
    ...item,
    path: item.dir + "/" + item.path,
  }));
  const res = await uploadFilesToGitHub(contents);
  if (res?.status === 200) {
    message.warning("上传成功");
    waitContents.value = [];
    updateNow();
  }
  uploading.value = false;
}
//立即上传
async function handleBeginUpload() {
  //等待上传队列
  waitContents.value.push(
    ...cloneDeepWith(
      tempContents.value.map((item) => ({
        ...item,
        dir: currentPath.value,
      })),
    ),
  );
  showSelectDir.value = false;
  handleUpload();
}
function handleOpenEnableFolder() {
  enableFolder.value = !enableFolder.value;
  nextTick(() => {
    folderNameInput.value?.focus();
  });
}
//创建文件夹
async function handleCreateFolder() {
  if (!folderName.value) {
    enableFolder.value = false;
    return;
  }
  const res = await useCreateFolder(currentPath.value ? `${currentPath.value}/` : currentPath.value + folderName.value);
  if (res?.status === 201) {
    enableFolder.value = false;
    folderName.value = "";
    await updateDirs();
    updateNow();
  } else {
    message.error("创建失败");
  }
}
</script>

<route lang="yaml">
name: upload
</route>

<template>
  <n-scrollbar style="height: calc(100vh - 90px)">
    <Header>
      {{ t("node.title") }}
      <template #optional>
        <Icon @click="handleClickUpload" icon="majesticons:camera" class="text-1.6rem cursor-pointer" />
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

      <div v-else class="mb-40px">
        <div class="text-1.1rem font-bold color-gray-8 dark:color-gray-4 mb-20px flex items-center">
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

    <DefineTemplate v-slot="{ $slots, icon, label, isLink, iconColor }">
      <div class="flex items-center cursor-pointer py-6px">
        <div class="flex-1 flex items-center">
          <Icon :icon="icon" class="text-3rem mr-10px" :class="[iconColor ? iconColor : 'color-blue-400']" />
          <div class="max-w-200px">
            <div class="color-gray-6" v-if="!$slots.input">
              {{ label }}
            </div>
            <component :is="$slots.input" />
          </div>
        </div>

        <Icon v-show="isLink" icon="material-symbols:arrow-forward-ios-rounded" class="text-16px color-gray-6" />
      </div>
    </DefineTemplate>

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
          <div class="flex justify-between">
            <span class="cursor-pointer color-primary-300" @click="handleOpenEnableFolder">
              {{ t("new_folder") }}
            </span>

            <div>
              <span v-if="currentPath" class="cursor-pointer color-primary-300" @click="removeUploadPath(currentPath)">
                {{ t("back") }}
              </span>
            </div>
          </div>

          <!-- 新建文件夹 -->
          <ReusableTemplate v-if="enableFolder" icon="ic:round-folder" is-link>
            <template #input>
              <n-input
                v-if="enableFolder"
                ref="folderNameInput"
                v-model:value="folderName"
                :placeholder="t('please_folder')"
                @blur="handleCreateFolder"
              />
            </template>
          </ReusableTemplate>

          <!-- 文件夹列表 -->
          <template v-if="currentDirs.length">
            <ReusableTemplate
              v-for="item in currentDirs"
              :key="item.sha"
              :label="item.name"
              icon="ic:round-folder"
              is-link
              @click="
                () => {
                  addUploadPath(item.path);
                }
              "
            />
          </template>

          <!-- 空文件夹 -->
          <ReusableTemplate v-else label="Empty" icon="ic:round-folder-open" icon-color="color-blue-100" is-link />
        </n-scrollbar>

        <div class="w-full text-center">
          <n-button type="primary" ghost class="mr-10px" @click="handleQueue">{{ t("node.button.queue") }}</n-button>
          <n-button type="primary" @click="handleBeginUpload">{{ t("node.button.immediately") }}</n-button>
        </div>
      </n-drawer-content>
    </n-drawer>

    <Tabbar />
  </n-scrollbar>
  <div class="text-center fixed bottom-100px w-full" v-show="waitContents.length">
    <n-button
      type="primary"
      @click="handleUpload"
      :render-icon="() => h(uploading ? LineMdLoadingLoop : SystemUiconsUpload)"
      :disabled="uploading"
      >{{ t("node.button.upload") }}
    </n-button>
  </div>
</template>

<style lang="less" scoped></style>
