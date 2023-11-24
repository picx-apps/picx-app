<script lang="ts" setup>
import { showImagePreview } from "../components/image-preview";
import { HomeImageDropDownOptions } from "../constant";
import { useGlobalState } from "../store";
import { useSettingState } from "../store/setting";
import { RepoContents } from "../types";
import { Icon } from "@iconify/vue";
import { writeText } from "@tauri-apps/api/clipboard";
import { isArray } from "lodash-es";
import { Octokit } from "octokit";

const { user, access_token, repo_name, branch_name, imagePaths, addImagePath, removeImagePath } = useGlobalState();
const { settings, currentCDN } = useSettingState();
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
const path = computed(() => (imagePaths.value.length > 0 ? imagePaths.value[imagePaths.value.length - 1] : ""));
const currentImage = ref<(typeof repoContent.value)[0] | null>(null);
const activeImageDelete = ref(false);
const { width } = useWindowSize();
const maxRowNumber = computed(() => Math.floor(width.value / 130));
const gridColGap = computed(() => Math.floor((width.value - maxRowNumber.value * 120) / maxRowNumber.value) + "px");
const toLocaleUpperCasePath = computed(() =>
  path.value.split("/")[path.value.split("/").length - 1].toLocaleUpperCase(),
);
const { t } = useI18n();
const refresh = ref(false);

async function contents() {
  const res = await octokit.request("GET /repos/{owner}/{repo}/contents/{path}", {
    owner: user.value?.login!,
    repo: repo_name.value,
    ref: branch_name.value,
    path: path.value,
    t: now.value,
  });
  if (res.status === 200) {
    const data = isArray(res.data) ? res.data : [res.data];
    repoContent.value = data.filter((item) => !settings.value.recycleBin[item.path]);
    showDirs.value = true;
    showLatest.value = true;
    showImages.value = true;
    refresh.value = false;
  }
}
function transformURL(path: string) {
  const uri = replacePlaceholder(currentCDN.value?.value!, {
    owner: user.value?.login!,
    repo: repo_name.value,
    branch: branch_name.value,
    path,
  });
  return uri;
}
watch(
  now,
  () => {
    contents();
  },
  { immediate: true },
);
function handleClickDir(item: (typeof repoContent.value)[0]) {
  repoContent.value = [];
  addImagePath(item.path);
  contents();
}
function handleClickBackUp() {
  removeImagePath(path.value);
  contents();
}
function handleClickImage(event: MouseEvent, item: (typeof repoContent.value)[0]) {
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
    activeImageDelete.value = true;
  }
}
async function handleDeleteImage() {
  activeImageDelete.value = false;
  const { name, path, sha } = currentImage.value!;
  const res = await octokit.request("DELETE /repos/{owner}/{repo}/contents/{path}", {
    owner: user.value!.login,
    repo: repo_name.value,
    path,
    sha,
    message: "picx delete file " + name,
  });
  if (res.status === 200) {
    message.warning("删除成功", {
      icon: () =>
        h(Icon, {
          icon: "icon-park-solid:grinning-face-with-squinting-eyes",
        }),
    });
    updateNow();
  }
}
function handleImage(index: number) {
  if (!files.value.length) return;
  const images = files.value.map((item) => transformURL(item.path));
  showImagePreview({ images, startPosition: index });
}
</script>

<route lang="yaml">
name: home
</route>

<template><div>hello</div></template>

<style lang="less" scoped></style>
