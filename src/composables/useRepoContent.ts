import { MaybeRefOrGetter } from "vue";
import { RepoContents } from "../types";

export function useRepoContent(contents: MaybeRefOrGetter<RepoContents>) {
  const image = computed(() =>
    toValue(contents).filter(
      (item) => item.type === "file" && isImage(item.name)
    )
  );
  const dir = computed(() =>
    toValue(contents).filter((item) => item.type === "dir")
  );
  return [dir, image];
}

function isImage(fileName: string) {
  const imageExtensions = /\.(jpg|jpeg|png|gif|bmp)$/i;
  return imageExtensions.test(fileName);
}
