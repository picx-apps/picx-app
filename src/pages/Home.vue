<script lang="ts" setup>
import { Icon } from "@iconify/vue";
import { useGlobalState } from "../store";
import { Octokit } from "octokit";
import { isArray } from "lodash-es";
import { RepoContents } from "../types";
import dirSvg from "../assets/images/dir.png?url";

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
const path = computed(() =>
  imagePaths.value.length > 0
    ? imagePaths.value[imagePaths.value.length - 1]
    : ""
);

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

onMounted(() => {
  contents();
});
</script>

<route lang="yaml">
name: home
</route>

<template>
  <n-scrollbar style="height: 100vh">
    <div class="header p-10px px-16px flex items-center">
      <div flex-1 class="flex items-center">
        <img
          :src="user?.avatar_url"
          :alt="user?.login"
          class="w-50px h-50px rounded-full mr-16px"
        />
        <div>
          <div class="text-18px lh-20px font-bold">
            {{ user?.name || user?.login }}
          </div>
          <div class="bio">晚上好，欢迎回来~</div>
        </div>
      </div>

      <div class="optional">
        <Icon icon="prime:inbox" class="text-26px" />
      </div>
    </div>

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
        <div class="image-list-container">
          <n-image
            v-for="item in files"
            width="80"
            height="100"
            :src="item.download_url!"
            lazy
            object-fit="cover"
            class="rounded-lg m-4px"
          />
        </div>
      </n-collapse-transition>
    </div>

    <Tabbar />
  </n-scrollbar>
</template>

<style lang="less" scoped>
.aa {
  color: #959595;
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
