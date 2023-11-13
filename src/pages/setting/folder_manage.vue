<script setup lang="ts">
import { Icon } from "@iconify/vue";
import { useUploadState } from "../../store/upload";
import { useSettings } from "../../settings";
const { t } = useI18n();

const {
  uploadPath,
  currentPath,
  currentDirs,
  addUploadPath,
  removeUploadPath,
  updateDirs,
} = useUploadState();

const [DefineTemplate, ReusableTemplate] = createReusableTemplate<{
  icon: string;
  iconColor?: string;
  label?: string;
  isLink: boolean;
}>();

const { getClonedSettings, setSettingsAndUpdateToRemote } = useSettings();

const onDelete = () => {
  const settings = getClonedSettings();
  if (currentPath.value) {
    settings.recycleBin[currentPath.value] = true;
  }
  setSettingsAndUpdateToRemote(settings);

  removeUploadPath(currentPath.value);
};
</script>
<template>
  <DefineTemplate v-slot="{ $slots, icon, label, isLink, iconColor }">
    <div class="flex items-center cursor-pointer py-6px">
      <div class="flex-1 flex items-center">
        <Icon
          :icon="icon"
          class="text-3rem mr-10px"
          :class="[iconColor ? iconColor : 'color-blue-400']"
        />
        <div class="max-w-200px">
          <div class="color-gray-6" v-if="!$slots.input">
            {{ label }}
          </div>
          <component :is="$slots.input" />
        </div>
      </div>

      <Icon
        v-show="isLink"
        icon="material-symbols:arrow-forward-ios-rounded"
        class="text-16px color-gray-6"
      />
    </div>
  </DefineTemplate>

  <Header :title="t('folder_manage.title')">
    <template #default>
      <Icon
        icon="material-symbols:arrow-back-ios-rounded"
        class="text-1.2rem cursor-pointer hover:color-primary-200"
        @click="$router.replace('/user')"
      />
    </template>
  </Header>

  <div m-x-15px>
    <div class="flex justify-between items-center">
      <div class="my-10px flex items-center">
        <div class="text-1.1rem font-bold flex items-center">
          {{ t("path") }}: {{ currentPath ? currentPath : "Root" }}
        </div>
        <div ml-10px h-full>
          <span class="cursor-pointer color-primary-400" @click="onDelete">
            {{ t("delete") }}
          </span>
        </div>
      </div>

      <div>
        <span
          v-if="currentPath"
          class="cursor-pointer color-primary-300"
          @click="removeUploadPath(currentPath)"
        >
          {{ t("back") }}
        </span>
      </div>
    </div>

    <!-- 文件夹列表 -->

    <template v-if="currentDirs.length">
      <ReusableTemplate
        v-for="item in currentDirs"
        :key="item.sha"
        :label="item.name"
        icon="ic:round-folder"
        is-link
        @click="
          () => {
            addUploadPath(item.path);
          }
        "
      />
    </template>

    <!-- 空文件夹 -->
    <ReusableTemplate
      v-else
      label="Empty"
      icon="ic:round-folder-open"
      icon-color="color-blue-100"
      is-link
    />
  </div>
</template>
