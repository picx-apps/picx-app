<script lang="ts" setup>
import { Icon } from "@iconify/vue";
import { writeText } from "@tauri-apps/api/clipboard";
import { showImagePreview } from "~/components/image-preview";
import { HomeImageDropDownOptions } from "~/constant";
import { useGlobalState } from "~/store";
import { useLibraryState } from "~/store/library";
import { useSettingState } from "~/store/setting";

const { images, removeFile } = useLibraryState();
const { user, repo_name, branch_name } = useGlobalState();
const { currentCDN } = useSettingState();

const { t } = useI18n();
const message = useMessage();
const dialog = useDialog();
const latest = computed(() => images.value.slice(0, 5));
const latestDebounced = refDebounced(latest, 300);
const mainInstance = ref<HTMLElement>();
const { width } = useElementSize(mainInstance);
const maxRowNumber = computed(() => Math.floor(width.value / 130));
const gridColGap = computed(() => Math.floor((width.value - maxRowNumber.value * 120) / maxRowNumber.value) + "px");
const currentImage = ref<(typeof images.value)[0] | null>(null);
const showDropdown = ref(false);
const dropDownPosition = reactive({
  x: 0,
  y: 0,
});
const loading = ref(false);

function transformURL(path: string) {
  const uri = replacePlaceholder(currentCDN.value?.value!, {
    owner: user.value?.login!,
    repo: repo_name.value,
    branch: branch_name.value,
    path,
  });
  return uri;
}
function updater() {
  loading.value = true;
  updateNow();
  setTimeout(() => {
    loading.value = false;
  }, 1000);
}
function handleClickImage(event: MouseEvent, item: (typeof images.value)[0]) {
  event.preventDefault();
  currentImage.value = item;
  showDropdown.value = true;
  dropDownPosition.x = event.clientX;
  dropDownPosition.y = event.clientY;
}
function handleImage(index: number) {
  if (!images.value.length) return;
  const result = images.value.map((item) => transformURL(item.path));
  showImagePreview({ images: result, startPosition: index });
}
function handleLatestImage(index: number) {
  if (!latestDebounced.value.length) return;
  const result = latestDebounced.value.map((item) => transformURL(item.path));
  showImagePreview({ images: result, startPosition: index });
}
async function handleImageDropDownSelect(key: string) {
  showDropdown.value = false;
  const { download_url, name, path } = currentImage.value!;
  const replace_url = replacePlaceholder(currentCDN.value?.value!, {
    owner: user.value?.login!,
    repo: repo_name.value,
    branch: branch_name.value,
    path,
  });
  if (key === "copy" && replace_url) {
    await writeText(replace_url);
    message.warning("复制成功", {
      icon: () => h(Icon, { icon: "icon-park-solid:grinning-face-with-squinting-eyes" }),
    });
  }
  if (key === "download" && download_url) {
    const data = await useImageToBinary(download_url);
    const success = await useWriteBinaryFile(data, name);
    success &&
      message.warning("下载成功", {
        icon: () =>
          h(Icon, {
            icon: "icon-park-solid:grinning-face-with-squinting-eyes",
          }),
      });
  }
  if (key === "delete") {
    handleDeleteImage();
  }
}
function handleDeleteImage() {
  const d = dialog.create({
    title: "Warning",
    content: t("home.delete_image_title"),
    showIcon: false,
    closable: false,
    negativeText: "Cancel",
    positiveText: "Ok",
    positiveButtonProps: {
      type: "primary",
      size: "large",
    },
    negativeButtonProps: {
      type: "primary",
      size: "large",
    },
    onPositiveClick: async () => {
      if (!currentImage.value) return;
      d.loading = true;
      const { path, sha } = currentImage.value;
      await removeFile({
        path,
        sha,
      });
      updateNow();
    },
    onNegativeClick: () => {},
  });
}
function handleImageOutside() {
  showDropdown.value = false;
  currentImage.value = null;
}
</script>

<route lang="yaml">
name: home
</route>

<template>
  <n-spin ref="mainInstance" class="px-16px h-full flex flex-col" :show="loading" style="--n-color: white">
    <TopOperate>
      <template #operate>
        <n-button tertiary circle class="w-30px h-30px mr-10px">
          <template #icon>
            <Icon icon="ic:outline-refresh" class="text-1.1rem" @click="() => updater()" />
          </template>
        </n-button>
      </template>
    </TopOperate>

    <n-scrollbar class="flex-1">
      <div class="latest">
        <div class="title">
          <div flex-1>{{ t("home.latest") }}</div>
        </div>

        <n-scrollbar x-scrollable>
          <div class="scroll-content h-166px">
            <n-image-group>
              <div
                v-for="(item, index) in latestDebounced"
                :key="item.sha"
                class="image-container"
                @click="handleLatestImage(index)"
              >
                <n-image
                  width="260"
                  height="160"
                  :src="transformURL(item.path)"
                  lazy
                  object-fit="cover"
                  class="rounded-lg"
                />
                <div class="text-overlay"></div>
                <div class="absolute top-10px left-10px font-bold color-white text-11px flex items-center">
                  <Icon icon="material-symbols:highlighter-size-1" class="text-16px" />
                  {{ bytesToMB(item.size) }}mb
                </div>
                <div class="absolute bottom-10px left-10px color-white font-bold text-11px">
                  {{ item.name }}
                </div>
              </div>
            </n-image-group>
          </div>
        </n-scrollbar>
      </div>

      <!-- 图库 -->
      <div class="image-list mb-20px">
        <div class="title">
          <div flex-1>{{ t("home.library") }}</div>
          <!-- <Icon
              icon="material-symbols:arrow-drop-down-circle"
              class="text-18px cursor-pointer select-none"
              @click="showImages = !showImages"
            /> -->
        </div>

        <n-collapse-transition>
          <div class="image-list-container">
            <n-image-group>
              <div
                class="w-110px h-130px relative"
                v-for="(item, index) in images"
                :key="item.sha"
                @contextmenu="handleClickImage($event, item)"
              >
                <n-image
                  :src="transformURL(item.path)"
                  lazy
                  object-fit="cover"
                  preview-disabled
                  class="rounded-lg w-100% h-100%"
                  :intersection-observer-options="{
                    root: '#app',
                  }"
                  @click="handleImage(index)"
                />
                <div class="image-list__filename">
                  {{ item.name }}
                </div>
              </div>
            </n-image-group>
          </div>
        </n-collapse-transition>
      </div>
    </n-scrollbar>

    <n-dropdown
      placement="bottom-start"
      trigger="manual"
      :x="dropDownPosition.x"
      :y="dropDownPosition.y"
      :options="HomeImageDropDownOptions"
      :show="showDropdown"
      @select="handleImageDropDownSelect"
      @clickoutside="handleImageOutside"
    />
  </n-spin>
</template>

<style lang="less" scoped>
.image-list__filename {
  width: 80px;
  position: absolute;
  bottom: 10px;
  left: 10px;
  color: white;
  font-weight: bold;
  font-size: 11px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.text-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(120deg, #dd62f943 16%, #9499ff78, #4d56fd5b);
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 0.5rem;
}
.image-container {
  height: 160px;
  position: relative;
  display: inline-block;
  & + & {
    margin-left: 16px;
  }
}
.image-list-container {
  display: grid;
  grid-template-columns: repeat(v-bind(maxRowNumber), minmax(0, 1fr));
  grid-row-gap: 15px;
  grid-column-gap: v-bind(gridColGap);
  cursor: pointer;
}
:deep(.image-list-container) .n-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: all 0.3s;
  &:hover {
    transform: scale(1.1);
  }
}

.scroll-content {
  white-space: nowrap;
  display: inline-block;
}
.latest .title,
.image-list .title {
  font-size: 18px;
  font-weight: bold;
  letter-spacing: 1px;
  color: #252525;
  margin: 15px 0 10px 0;
  display: flex;
  align-items: center;
  .dark & {
    color: white;
  }
}
</style>
