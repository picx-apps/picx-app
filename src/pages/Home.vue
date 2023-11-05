<script lang="ts" setup>
import { Icon } from "@iconify/vue";
import { useGlobalState } from "../store";
import { Octokit } from "octokit";
import { isArray } from "lodash-es";
import { RepoContents } from "../types";
import dirSvg from "../assets/images/dir.png?url";
import { HomeImageDropDownOptions } from "../constant";
import { writeText } from "@tauri-apps/api/clipboard";

const {
  user,
  access_token,
  repo_name,
  branch_name,
  imagePaths,
  addImagePath,
  removeImagePath,
} = useGlobalState();
const repoContent = ref<RepoContents>([]);
const octokit = new Octokit({
  auth: access_token.value,
});
const [dirs, files] = useRepoContent(repoContent);
const latest = computed(() => files.value.slice(0, 5));
const latestDebounced = refDebounced(latest, 300);
const showLatest = ref(false);
const showDirs = ref(false);
const showImages = ref(false);
const showDropdown = ref(false);
const dropDownPosition = reactive({
  x: 0,
  y: 0,
});
const message = useMessage();
const path = computed(() =>
  imagePaths.value.length > 0
    ? imagePaths.value[imagePaths.value.length - 1]
    : ""
);
const currentImage = ref<(typeof repoContent.value)[0] | null>(null);
const activeImageDelete = ref(false);

watchEffect(() => {
  console.log(dirs.value);
});

async function contents() {
  const res = await octokit.request(
    "GET /repos/{owner}/{repo}/contents/{path}",
    {
      owner: user.value?.login!,
      repo: repo_name.value,
      ref: branch_name.value,
      path: path.value,
    }
  );
  if (res.status === 200) {
    repoContent.value = isArray(res.data) ? res.data : [res.data];
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
  showDropdown.value = false;
  nextTick().then(() => {
    showDropdown.value = true;
    dropDownPosition.x = event.clientX;
    dropDownPosition.y = event.clientY;
  });
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

onMounted(() => {
  contents();
});
</script>

<route lang="yaml">
name: home
</route>

<template>
  <n-scrollbar style="height: 100vh">
    <Header>
      <template #optional>
        <Icon icon="prime:inbox" class="text-26px" />
      </template>
    </Header>

    <!-- 最近添加 -->
    <div class="latest px-16px">
      <div class="title">
        <div flex-1>最近添加</div>
        <Icon
          icon="material-symbols:arrow-drop-down-circle"
          class="text-18px cursor-pointer select-none"
          @click="showLatest = !showLatest"
        />
      </div>

      <n-collapse-transition :show="showLatest">
        <n-scrollbar x-scrollable>
          <div class="scroll-content">
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
          </div>
        </n-scrollbar>
      </n-collapse-transition>
    </div>

    <!-- 文件夹 -->
    <div class="list px-16px">
      <div class="title">
        <div flex-1>文件夹</div>
        <Icon
          icon="material-symbols:arrow-drop-down-circle"
          class="text-18px cursor-pointer select-none"
          @click="showDirs = !showDirs"
        />
      </div>

      <n-collapse-transition :show="showDirs">
        <n-scrollbar x-scrollable>
          <div class="scroll-content">
            <div
              class="dir-container"
              v-show="path !== ''"
              @click="handleClickBackUp"
            >
              <Icon
                icon="ion:arrow-undo-sharp"
                class="text-45px"
                style="color: var(--color-purple)"
              />
              <div class="dir-name mt-8px">返回</div>
            </div>

            <div
              v-for="item in dirs"
              :key="item.sha"
              class="dir-container"
              @click="handleClickDir(item)"
            >
              <img :src="dirSvg" class="w-45px" />
              <div class="dir-name">
                {{ item.name }}
              </div>
            </div>
          </div>
        </n-scrollbar>
      </n-collapse-transition>
    </div>

    <!-- 图库 -->
    <div class="image-list px-16px mb-80px">
      <div class="title">
        <div flex-1>
          图库
          <span class="text-10px"
            >路径:
            <span style="color: var(--color-purple)">{{
              path ? path : "根"
            }}</span></span
          >
        </div>
        <Icon
          icon="material-symbols:arrow-drop-down-circle"
          class="text-18px cursor-pointer select-none"
          @click="showImages = !showImages"
        />
      </div>

      <n-collapse-transition :show="showImages">
        <div
          class="image-list-container grid grid-gap-10px grid-cols-3 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-7 xl:grid-cols-8"
        >
          <div
            class="w-100px h-100px"
            v-for="item in files"
            @contextmenu="handleClickImage($event, item)"
          >
            <n-image
              :src="item.download_url!"
              lazy
              object-fit="cover"
              class="rounded-lg w-100% h-100%"
              :intersection-observer-options="{
                root: '#app',
              }"
            />
          </div>
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
      @clickoutside="
        () => {
          showDropdown = false;
          currentImage = null;
        }
      "
    />

    <n-drawer
      v-model:show="activeImageDelete"
      placement="bottom"
      height="200"
      :drawer-style="{ borderRadius: '18px 18px 0 0' }"
    >
      <n-drawer-content>
        <div class="text-14px color-#aaaaaa text-center mt-10px">
          确定删除吗?
        </div>
        <n-button
          type="error"
          ghost
          class="w-100% my-20px"
          @click="handleDeleteImage"
        >
          删除
        </n-button>
        <n-button
          type="primary"
          ghost
          class="w-100%"
          @click="activeImageDelete = false"
        >
          取消
        </n-button>
      </n-drawer-content>
    </n-drawer>

    <Tabbar />
  </n-scrollbar>
</template>

<style lang="less" scoped>
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
  width: 80px;
  height: 80px;
  display: inline-flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 8px;
  cursor: pointer;
  &:hover,
  &:active {
    transform: scale(0.96);
  }
  & + & {
    margin-left: 4px;
  }
  .dir-name {
    line-height: 12px;
    width: 50px;
    font-size: 10px;
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
}
:deep(.image-list-container) .n-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.scroll-content {
  white-space: nowrap;
  display: inline-block;
}
.latest .title,
.list .title,
.image-list .title {
  font-size: 16px;
  font-weight: bold;
  letter-spacing: 1px;
  color: #5d5d5d;
  margin: 10px 0;
  display: flex;
  align-items: center;
}
.username {
  font-size: 18px;
  line-height: 20px;
  font-weight: bold;
  color: var(--text-primary);
}
.bio {
  font-size: 11px;
  color: #959595;
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
