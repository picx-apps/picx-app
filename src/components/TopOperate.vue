<script lang="ts" setup>
import { Icon } from "@iconify/vue";
import { checkUpdate, UpdateResult } from "@tauri-apps/api/updater";
import { UserOptions, type UserOptionsKey } from "~/constant";
import { useGlobalState } from "~/store";
import { useRouteState } from "~/store/route";

defineSlots<{
  operate: void;
}>();

const { t } = useI18n();
const router = useRouter();
const dialog = useDialog();
const { user } = useGlobalState();
const { canBack, canForward, currentPathIndex, routeHistory } = useRouteState();
const update = ref<UpdateResult | null>(null);

onMounted(async () => {
  update.value = await checkUpdate();
});

function handleSelect(key: UserOptionsKey) {
  if (key === "settings") {
    router.push({ name: "user" });
  }
  if (key === "signOut") {
    dialog.create({
      title: "Warning",
      content: t("sign_out_content"),
      showIcon: false,
      closable: false,
      positiveText: t("confirm"),
      negativeText: t("cancel"),
      negativeButtonProps: {
        type: "primary",
        size: "large",
      },
      positiveButtonProps: {
        type: "primary",
        size: "large",
      },
      onPositiveClick: () => {
        localStorage.clear();
        router.replace("/login");
      },
    });
  }
  // if (key === "checkUpdate") {
  //   handleUpdate();
  // }
}
function handleBack() {
  const path = routeHistory.value[currentPathIndex.value - 1];
  router.replace(path);
}
function handleForward() {
  const path = routeHistory.value[currentPathIndex.value + 1];
  router.replace(path);
}
// function handleUpdate() {
//   if (!update.value) return;
//   if (update.value.shouldUpdate === false) {
//     message("It is already the latest version.", { type: "info", title: "Picx app" });
//     // dialog.create({
//     //   title: "Picx app",
//     //   content: () => h("div", `It is already the latest version.`),
//     //   showIcon: false,
//     //   style: {
//     //     width: "300px",
//     //   },
//     // });
//   }
// }
</script>

<i18n lang="json">
{
  "en-US": {
    "sign_out_content": "Are you sure you want to sign out?"
  },
  "zh-CN": {
    "sign_out_content": "你确定要退出吗?"
  }
}
</i18n>

<template>
  <div class="py-10px flex items-center">
    <div class="w-70px flex justify-between">
      <n-button tertiary circle class="w-30px h-30px" @click="handleBack" :disabled="!canBack">
        <template #icon>
          <Icon icon="material-symbols:arrow-back-ios-new-rounded" class="text-1rem ml--2px" />
        </template>
      </n-button>
      <n-button tertiary circle class="w-30px h-30px" @click="handleForward" :disabled="!canForward">
        <template #icon>
          <Icon icon="material-symbols:arrow-forward-ios-rounded" class="text-1rem ml-2px" />
        </template>
      </n-button>
    </div>

    <div class="flex-1 flex items-center justify-end">
      <slot name="operate" />
      <n-dropdown :options="UserOptions" trigger="click" @select="handleSelect">
        <img :src="user?.avatar_url" class="w-24px h-24px rounded-full cursor-pointer" b="4px solid #d2d2d226" />
      </n-dropdown>
    </div>
  </div>
</template>

<style lang="less" scoped></style>
