<script lang="ts" setup>
import { Icon } from "@iconify/vue";
import { useGlobalState } from "../store";
import { Octokit } from "octokit";
import { isArray } from "lodash-es";
import { RepoContents } from "../types";
import { HomeImageDropDownOptions } from "../constant";
import { writeText } from "@tauri-apps/api/clipboard";
import { showImagePreview } from "../components/image-preview";
import { useSettingState } from "../store/setting";

const {
  user,
  access_token,
  repo_name,
  branch_name,
  imagePaths,
  addImagePath,
  removeImagePath,
} = useGlobalState();
const { settings } = useSettingState();
const repoContent = ref<RepoContents>([]);
const octokit = new Octokit({
  auth: access_token.value,
});
const [dirs, files] = useRepoContent(repoContent);
const latest = computed(() => files.value.slice(0, 5));
const latestDebounced = refDebounced(latest, 300);
const showLatest = ref(false);
const showDirs = ref(true);
const showImages = ref(true);
const showDropdown = ref(false);
const dropDownPosition = reactive({
  x: 0,
  y: 0,
});
const message = useMessage();
const time = useStorage("picx-update-key", Date.now()); //缓存更新时间
const path = computed(() =>
  imagePaths.value.length > 0
    ? imagePaths.value[imagePaths.value.length - 1]
    : ""
);
const currentImage = ref<(typeof repoContent.value)[0] | null>(null);
const activeImageDelete = ref(false);
const { width } = useWindowSize();
const maxRowNumber = computed(() => Math.floor(width.value / 130));
const gridColGap = computed(
  () =>
    Math.floor((width.value - maxRowNumber.value * 120) / maxRowNumber.value) +
    "px"
);
const toLocaleUpperCasePath = computed(() =>
  path.value.split("/")[path.value.split("/").length - 1].toLocaleUpperCase()
);
const { t } = useI18n();

async function contents() {
  const res = await octokit.request(
    "GET /repos/{owner}/{repo}/contents/{path}",
    {
      owner: user.value?.login!,
      repo: repo_name.value,
      ref: branch_name.value,
      path: path.value,
      t: time.value,
    }
  );
  if (res.status === 200) {
    const data = isArray(res.data) ? res.data : [res.data];
    repoContent.value = data.filter(
      (item) => !settings.value.recycleBin[item.path]
    );
    showDirs.value = true;
    showLatest.value = true;
    showImages.value = true;
  }
}
function handleClickDir(item: (typeof repoContent.value)[0]) {
  repoContent.value = [];
  addImagePath(item.path);
  contents();
}
function handleClickBackUp() {
  removeImagePath(path.value);
  contents();
}
function handleClickImage(
  event: MouseEvent,
  item: (typeof repoContent.value)[0]
) {
  event.preventDefault();
  currentImage.value = item;
  showDropdown.value = true;
  dropDownPosition.x = event.clientX;
  dropDownPosition.y = event.clientY;
}
function handleImageOutside() {
  showDropdown.value = false;
  currentImage.value = null;
}
async function handleImageDropDownSelect(key: string) {
  showDropdown.value = false;
  const { download_url, name } = currentImage.value!;
  if (key === "copy" && download_url) {
    await writeText(download_url);
    message.warning("复制成功", {
      icon: () =>
        h(Icon, { icon: "icon-park-solid:grinning-face-with-squinting-eyes" }),
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
    activeImageDelete.value = true;
  }
}
async function handleDeleteImage() {
  activeImageDelete.value = false;
  const { name, path, sha } = currentImage.value!;
  const res = await octokit.request(
    "DELETE /repos/{owner}/{repo}/contents/{path}",
    {
      owner: user.value!.login,
      repo: repo_name.value,
      path,
      sha,
      message: "picx delete file " + name,
    }
  );
  if (res.status === 200) {
    message.warning("删除成功", {
      icon: () =>
        h(Icon, {
          icon: "icon-park-solid:grinning-face-with-squinting-eyes",
        }),
    });
    contents();
  }
}
function handleImage(index: number) {
  if (!files.value.length) return;
  const images = files.value.map((item) => item.download_url!);
  showImagePreview({ images, startPosition: index });
}

onMounted(() => {
  contents();
});
</script>

<route lang="yaml">
name: home
</route>

<template>
  <n-scrollbar style="height: 100vh" :size="0">
    <Header>
      {{ t("home.title") }}
      <template #optional>
        <Icon
          icon="ic:round-refresh"
          class="text-26px ml-6px cursor-pointer"
          @click="
            () => {
              time = Date.now();
              contents();
            }
          "
        />
        <!-- <Icon icon="ic:baseline-plus" class="text-26px ml-6px cursor-pointer" /> -->
      </template>
    </Header>

    <!-- 文件夹 -->
    <div class="list px-16px">
      <div class="title">
        <div flex-1>
          {{ path ? toLocaleUpperCasePath : t("root") }}
          <span
            class="text-10px ml-2px color-blue-500 cursor-pointer"
            @click="handleClickBackUp"
            v-if="path"
          >
            {{ t("back") }}
          </span>
        </div>
      </div>

      <n-collapse-transition :show="showDirs">
        <n-scrollbar x-scrollable>
          <div class="scroll-content h-100px">
            <div
              class="dir-container disabled ml-4px color-primary-100"
              v-show="!dirs.length"
            >
              <Icon icon="ic:round-folder-open" class="text-4.8rem" />
              <div class="dir-name">{{ t("empty") }}</div>
            </div>

            <div
              v-for="item in dirs"
              :key="item.sha"
              class="dir-container"
              @click="handleClickDir(item)"
            >
              <Icon icon="ic:round-folder" class="text-4.8rem color-blue-400" />
              <div class="dir-name">
                {{ item.name }}
              </div>
            </div>
          </div>
        </n-scrollbar>
      </n-collapse-transition>
    </div>

    <!-- 最近添加 -->
    <div class="latest px-16px">
      <div class="title">
        <div flex-1>{{ t("home.latest") }}</div>
        <!-- <Icon
            icon="material-symbols:arrow-drop-down-circle"
            class="text-18px cursor-pointer select-none"
            @click="showLatest = !showLatest"
          /> -->
      </div>

      <n-collapse-transition :show="showLatest">
        <n-scrollbar x-scrollable>
          <div class="scroll-content h-166px">
            <n-image-group>
              <div
                v-for="item in latestDebounced"
                :key="item.sha"
                class="image-container"
              >
                <n-image
                  width="260"
                  height="160"
                  :src="item.download_url!"
                  lazy
                  object-fit="cover"
                  class="rounded-lg"
                />
                <div class="text-overlay"></div>
                <div
                  class="absolute top-10px left-10px font-bold color-white text-11px flex items-center"
                >
                  <Icon
                    icon="material-symbols:highlighter-size-1"
                    class="text-16px"
                  />
                  {{ bytesToMB(item.size) }}mb
                </div>
                <div
                  class="absolute bottom-10px left-10px color-white font-bold text-11px"
                >
                  {{ item.name }}
                </div>
              </div>
            </n-image-group>
          </div>
        </n-scrollbar>
      </n-collapse-transition>
    </div>

    <!-- 图库 -->
    <div class="image-list px-16px mb-80px">
      <div class="title">
        <div flex-1>{{ t("home.library") }}</div>
        <!-- <Icon
            icon="material-symbols:arrow-drop-down-circle"
            class="text-18px cursor-pointer select-none"
            @click="showImages = !showImages"
          /> -->
      </div>

      <n-collapse-transition :show="showImages">
        <div class="image-list-container">
          <n-image-group>
            <div
              class="w-110px h-130px relative"
              v-for="(item, index) in files"
              @contextmenu="handleClickImage($event, item)"
            >
              <n-image
                :src="item.download_url!"
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

    <n-drawer
      v-model:show="activeImageDelete"
      placement="bottom"
      height="200"
      :drawer-style="{ borderRadius: '18px 18px 0 0' }"
    >
      <n-drawer-content>
        <div class="text-14px color-#aaaaaa text-center mt-10px">
          {{ t("delete tip") }}
        </div>
        <n-button
          type="error"
          ghost
          class="w-100% my-20px"
          @click="handleDeleteImage"
        >
          {{ t("confirm") }}
        </n-button>
        <n-button
          type="primary"
          ghost
          class="w-100%"
          @click="activeImageDelete = false"
        >
          {{ t("cancel") }}
        </n-button>
      </n-drawer-content>
    </n-drawer>

    <Tabbar />
  </n-scrollbar>
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
  width: 260px;
  height: 160px;
  position: relative;
  display: inline-block;
  & + & {
    margin-left: 16px;
  }
}
.dir-container {
  width: 100px;
  height: 100px;
  display: inline-flex;
  flex-direction: column;
  justify-content: center;
  align-items: start;
  border-radius: 8px;
  cursor: pointer;
  margin-right: 4px;
  &.disabled:hover,
  &.disabled:active {
    transform: scale(1);
    cursor: not-allowed;
  }
  &:hover,
  &:active {
    transform: scale(0.96);
  }
  & + & {
    margin-left: 4px;
  }
  .dir-name {
    line-height: 12px;
    height: 24px;
    width: 78px;
    font-size: 12px;
    color: #5d5d5d;
    text-align: center;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2; /* 控制文本行数 */
    white-space: normal; /* 多余的文本换行 */
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
.list .title,
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
.username {
  font-size: 18px;
  line-height: 20px;
  font-weight: bold;
  color: var(--text-primary);
}
.optional {
  height: 26px;
  display: flex;
  align-items: center;
  span {
    font-size: 18px;
  }
}
</style>
