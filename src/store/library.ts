import { useGlobalState } from ".";
import { useSettingState } from "./setting";
import { RepoContents } from "~/types";
import { isArray } from "lodash-es";

export interface RemoveFileProps {
  path: string;
  sha: string;
  message?: string;
}

const { user, octokit, repo_name, branch_name } = useGlobalState();
const { settings } = useSettingState();

export const useLibraryState = createGlobalState(() => {
  const imagePath = ref<string[]>([]);
  const contents = ref<RepoContents>([]);
  const [library, images] = useRepoContent(contents);
  const currentPath = computed(() => imagePath.value[imagePath.value.length - 1] || "");

  async function syncContents() {
    contents.value = [];
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
  async function createLibrary(name: string) {
    if (!name) return;
    const path = (currentPath.value ? `${currentPath.value}/` : currentPath.value) + name;
    const res = await useCreateFolder(path);
    if (res?.status === 201) {
      await syncContents();
      updateNow();
      return true;
    }
    return false;
  }
  async function removeFile(data: RemoveFileProps) {
    const res = await octokit.value.request("DELETE /repos/{owner}/{repo}/contents/{path}", {
      owner: user.value!.login,
      repo: repo_name.value,
      path: data.path,
      sha: data.sha,
      message: data.message ? data.message : "picx delete file " + data.path,
    });
    if (res.status === 200) {
      return true;
    }
    return false;
  }
  function addImagePath(value: string) {
    imagePath.value.push(value);
  }
  function removeImagePath(value: string) {
    const index = imagePath.value.indexOf(value);
    if (index !== -1) {
      imagePath.value.splice(index, 1);
    }
  }

  watch(
    [now, currentPath],
    () => {
      syncContents();
    },
    { immediate: true },
  );

  return {
    library,
    images,
    imagePath,
    currentPath,
    contents,
    createLibrary,
    removeFile,
    addImagePath,
    removeImagePath,
  };
});
