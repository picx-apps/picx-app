import { Icon } from "@iconify/vue";
import { shell } from "@tauri-apps/api";
import { useGlobalState } from "~/store";

const { user } = useGlobalState();

export const GithubLink = defineComponent(() => {
  return () => (
    <div
      class="px-14px h-38px lh-38px flex items-center justify-between w-180px cursor-pointer mx-4px rounded-6px hover:bg-#ffffff17 transition-colors duration-30"
      onClick={() => {
        shell.open(user.value?.html_url || "");
      }}
    >
      <span>个人资料</span>
      <Icon icon="iconamoon:link-external" class="text-1rem" />
    </div>
  );
});
