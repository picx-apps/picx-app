<script lang="ts" setup>
import { useGlobalState } from "../../store";
import { Icon } from "@iconify/vue";

const { t } = useI18n();
const { repository } = useGlobalState();
const tempRepository = ref({ ...repository.value });
const isUpdater = computed(() => {
  return (
    tempRepository.value.repo_name !== repository.value.repo_name ||
    tempRepository.value.branch_name !== repository.value.branch_name
  );
});
</script>

<template>
  <n-scrollbar style="height: 100vh">
    <Header :title="t('repositories.title')">
      <template #default>
        <Icon
          icon="material-symbols:arrow-back-ios-rounded"
          class="text-1.2rem cursor-pointer hover:color-primary-200"
          @click="$router.replace('/user')"
        />
      </template>
    </Header>

    <div class="px-16px">
      <RepoSetting v-model="tempRepository" />
      <n-button
        v-show="isUpdater"
        type="primary"
        ghost
        class="w-full"
        @click="
          () => {
            repository = { ...tempRepository };
            $router.replace('/user');
          }
        "
      >
        {{ t("repositories.complete") }}
      </n-button>
    </div>
  </n-scrollbar>
</template>

<style lang="less" scoped></style>
