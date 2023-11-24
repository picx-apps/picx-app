<script lang="ts" setup>
import { useGlobalState } from "../store";
import { useUploadState } from "../store/upload";
import type { UploadContent } from "../types/upload";
import { Icon } from "@iconify/vue";
import { invoke } from "@tauri-apps/api";
import { open } from "@tauri-apps/api/dialog";
import LibraryCard from "~/components/LibraryCard.vue";
import { useSettingState } from "~/store/setting";
import LineMdLoadingLoop from "~icons/line-md/loading-loop";
import PhPlusBold from "~icons/ph/plus-bold";
import PhUploadSimpleBold from "~icons/ph/upload-simple-bold";
import { cloneDeepWith } from "lodash-es";
import { NButton } from "naive-ui";

const dialog = useDialog();
const tempContents = ref<UploadContent[]>([]);
const waitContents = ref<UploadContent[]>([]);
const { currentPath } = useUploadState();
const { settings } = useSettingState();
const { compress } = useGlobalState();
const message = useMessage();
const { t } = useI18n();
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
  const d = dialog.create({
    title: t("node.select_upload_to_library"),
    content: () => h(LibraryCard),
    showIcon: false,
    closable: false,
    // negativeText: t("node.button.immediately"),
    // positiveText: t("node.button.queue"),
    action: () =>
      h("div", { style: { display: "flex", alignItems: "center" } }, [
        h(
          NButton,
          {
            type: "default",
            size: "large",
            style: { marginRight: "10px" },
            loading: uploading.value,
            onClick: async () => {
              d.loading = true;
              uploading.value = true;
              await handleBeginUpload();
              d.destroy();
            },
          },
          t("node.button.immediately"),
        ),
        h(
          NButton,
          {
            type: "primary",
            size: "large",
            onClick: () => {
              handleQueue();
              d.destroy();
            },
          },
          t("node.button.queue"),
        ),
      ]),
    onAfterLeave: () => handleAfterLeave(),
  });
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
}
//上传
async function handleUpload(contents?: UploadContent[]) {
  uploading.value = true;
  const _contents = (contents ? contents : waitContents.value).map((item) => ({
    ...item,
    path: item.dir + "/" + item.path,
  }));
  const res = await uploadFilesToGitHub(_contents);
  if (res?.status === 200) {
    message.warning("上传成功");
    waitContents.value = [];
    updateNow();
  }
  uploading.value = false;
}
//立即上传
async function handleBeginUpload() {
  await handleUpload(
    tempContents.value.map((item) => ({
      ...item,
      dir: currentPath.value,
    })),
  );
}
</script>

<route lang="yaml">
name: upload
</route>

<template>
  <main ref="mainInstance" class="px-16px relative h-full flex flex-col">
    <TopOperate></TopOperate>

    <n-scrollbar class="px-16px pt-16px flex-1">
      <div v-if="!waitContents.length">
        <div
          class="text-center mt-0px rounded-10px pb-20px cursor-pointer hover:b-#21214a select-none"
          b="3px dashed gray-8"
          @click="handleClickUpload"
        >
          <Icon icon="fluent-emoji:astronaut-light" class="w-300px h-300px" />

          <div class="text-1.2rem font-bold color-gray-7">
            {{ t("node.info") }}
          </div>
        </div>
      </div>

      <template v-else>
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
      </template>
    </n-scrollbar>

    <div class="text-center h-80px lh-80px" v-show="waitContents.length">
      <n-button
        type="primary"
        size="large"
        @click="handleClickUpload"
        :render-icon="() => h(PhPlusBold)"
        :disabled="uploading"
        class="mr-10px"
        >{{ t("node.button.continue_to_add") }}
      </n-button>
      <n-button
        color="#3728b9"
        size="large"
        @click="handleUpload()"
        :render-icon="() => h(uploading ? LineMdLoadingLoop : PhUploadSimpleBold)"
        :disabled="uploading"
        >{{ t("node.button.upload") }}
      </n-button>
    </div>
  </main>
</template>

<style lang="less" scoped></style>
