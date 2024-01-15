<script lang="ts" setup>
import { Icon } from "@iconify/vue";
import { useGlobalState } from "~/store";
import { useLibraryState } from "~/store/library";
import { useSettingState } from "~/store/setting";

const router = useRouter();
const { t } = useI18n();
const { repository } = useGlobalState();
const { syncContents } = useLibraryState();
const { autoCreateOfSettings } = useSettingState();
const tempRepository = ref({ ...repository.value });
const isUpdater = computed(() => {
  return (
    tempRepository.value.repo_name !== repository.value.repo_name ||
    tempRepository.value.branch_name !== repository.value.branch_name
  );
});
function updater() {
  repository.value = { ...tempRepository.value };
  syncContents();
  autoCreateOfSettings();
  router.replace({ name: "user" });
}
</script>

<route lang="yaml">
name: repo_manage
</route>

<template>
  <n-scrollbar style="height: 100vh" id="repo-container">
    <Header :title="t('repositories.title')">
      <template #default>
        <Icon
          icon="material-symbols:arrow-back-ios-rounded"
          class="text-1.2rem cursor-pointer hover:color-primary-200"
          @click="$router.replace({ name: 'user' })"
        />
      </template>
    </Header>

    <div class="px-16px">
      <RepoSetting v-model="tempRepository" to="#repo-container" />
      <n-button v-show="isUpdater" type="primary" ghost class="w-full" @click="updater">
        {{ t("repositories.complete") }}
      </n-button>
    </div>
  </n-scrollbar>
</template>

<style lang="less" scoped></style>
