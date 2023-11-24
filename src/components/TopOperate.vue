<script lang="ts" setup>
import { Icon } from "@iconify/vue";
import { UserOptions, type UserOptionsKey } from "~/constant";
import { useGlobalState } from "~/store";
import { useRouteState } from "~/store/route";

const router = useRouter();
const dialog = useDialog();
const { user } = useGlobalState();
const { canBack, canForward, currentPathIndex, routeHistory } = useRouteState();

function handleSelect(key: UserOptionsKey) {
  if (key === "settings") {
    router.push("/user");
  }
  if (key === "signOut") {
    dialog.create({
      title: "Warning",
      content: "Are you sure you want to sign out?",
      showIcon: false,
      closable: false,
      positiveText: "Yes",
      negativeText: "No",
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
}
function handleBack() {
  const path = routeHistory.value[currentPathIndex.value - 1];
  router.replace(path);
}
function handleForward() {
  const path = routeHistory.value[currentPathIndex.value + 1];
  router.replace(path);
}
</script>

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

    <div class="flex-1 text-right">
      <n-dropdown :options="UserOptions" trigger="click" @select="handleSelect">
        <img :src="user?.avatar_url" class="w-24px h-24px rounded-full cursor-pointer" b="4px solid #d2d2d226" />
      </n-dropdown>
    </div>
  </div>
</template>

<style lang="less" scoped></style>
