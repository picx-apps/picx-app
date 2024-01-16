import { RepoContents } from "../types";
import { useGlobalState } from "~/store";
import { useSettingState } from "~/store/setting";
import { MaybeRefOrGetter } from "vue";

const { settings, currentCDN } = useSettingState();
const { user, repo_name, branch_name } = useGlobalState();

export function useRepoContent(contents: MaybeRefOrGetter<RepoContents>) {
  const image = computed(() => toValue(contents).filter((item) => item.type === "file" && isImage(item.name)));
  const dir = computed(() =>
    toValue(contents).filter((item) => item.type === "dir" && !settings.value.recycleBin[item.path]),
  );
  return [dir, image];
}

function isImage(fileName: string) {
  const imageExtensions = /\.(jpg|jpeg|png|gif|bmp)$/i;
  return imageExtensions.test(fileName);
}

export function transformURL(path: string) {
  const uri = replacePlaceholder(currentCDN.value?.value!, {
    owner: user.value?.login!,
    repo: repo_name.value,
    branch: branch_name.value,
    path,
  });
  return uri;
}
