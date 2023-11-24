import { useGlobalState } from ".";
import { useSettingState } from "./setting";
import { RepoContents } from "~/types";
import { isArray } from "lodash-es";

const { user, octokit, repo_name, branch_name } = useGlobalState();
const { settings } = useSettingState();

export const useGalleryState = createGlobalState(() => {
  const imagePath = ref<string[]>([]);
  const contents = ref<RepoContents>([]);
  const [gallery, images] = useRepoContent(contents);
  const currentPath = computed(() => imagePath.value[imagePath.value.length - 1]);

  async function syncContents() {
    const res = await octokit.value.request("GET /repos/{owner}/{repo}/contents/{path}", {
      owner: user.value?.login!,
      repo: repo_name.value,
      ref: branch_name.value,
      path: currentPath.value,
      t: now.value,
    });
    if (res.status === 200) {
      const data = isArray(res.data) ? res.data : [res.data];
      //排除配置文件中已删除的
      contents.value = data.filter((item) => !settings.value.recycleBin[item.path]);
    }
  }

  watch(
    [now, currentPath],
    () => {
      syncContents();
    },
    { immediate: true },
  );

  return { gallery, images, imagePath, currentPath, contents };
});
