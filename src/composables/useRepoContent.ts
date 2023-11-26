import { RepoContents } from "../types";
import { useSettingState } from "~/store/setting";
import { MaybeRefOrGetter } from "vue";

const { settings } = useSettingState();

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
