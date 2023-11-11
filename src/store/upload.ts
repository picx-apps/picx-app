import { isArray } from "lodash-es";
import { useGlobalState } from "./";
import { RepoContents } from "../types";

const { octokit, user, repo_name, branch_name } = useGlobalState();

export const useUploadState = createGlobalState(() => {
  const uploadPath = useStorage<string[]>("picx-upload-path", [], localStorage);
  const currentDirs = ref<RepoContents>([]);
  const time = useStorage("picx-update-key", Date.now()); //缓存更新时间

  const currentPath = computed(() =>
    uploadPath.value.length > 0
      ? uploadPath.value[uploadPath.value.length - 1]
      : ""
  );

  function addUploadPath(value: string) {
    uploadPath.value.push(value);
  }
  function removeUploadPath(value: string) {
    const index = uploadPath.value.indexOf(value);
    if (index !== -1) {
      uploadPath.value.splice(index, 1);
    }
  }
  async function fetchDirs() {
    if (!octokit.value) return;
    const path = uploadPath.value[uploadPath.value.length - 1];

    const res = await octokit.value.request(
      "GET /repos/{owner}/{repo}/contents/{path}",
      {
        owner: user.value?.login!,
        repo: repo_name.value,
        ref: branch_name.value,
        path: path,
        t: time.value,
      }
    );
    if (res.status === 200) {
      const data = isArray(res.data) ? res.data : [res.data];
      currentDirs.value = useRepoContent(data)[0].value;
      console.log("upload_dirs", currentDirs.value);
    }
  }
  function updateDirs() {
    time.value = Date.now();
    fetchDirs();
  }

  watch(
    uploadPath,
    () => {
      fetchDirs();
    },
    { deep: true, immediate: true }
  );

  return {
    uploadPath,
    currentDirs,
    currentPath,
    updateDirs,
    addUploadPath,
    removeUploadPath,
  };
});
