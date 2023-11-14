<script setup lang="ts">
import { Icon } from "@iconify/vue";
import { useUploadState } from "../../store/upload";
import { useSettingState } from "../../store/setting";
const { t } = useI18n();
import { FolderDropDownOptions } from "../../constant";
import { RepoContents } from "../../types";

const { currentPath, currentDirs, addUploadPath, removeUploadPath } =
  useUploadState();
const { settings, updateSettingsFile } = useSettingState();
const [DefineTemplate, ReusableTemplate] = createReusableTemplate<{
  icon: string;
  iconColor?: string;
  label?: string;
}>();
const toLocaleUpperCasePath = computed(() =>
  currentPath.value
    .split("/")
    [currentPath.value.split("/").length - 1].toLocaleUpperCase()
);
const currentFolder = ref<RepoContents[0] | null>(null);
const showDropdown = ref(false);
const dropDownPosition = reactive({
  x: 0,
  y: 0,
});

async function handleImageDropDownSelect(key: string) {
  showDropdown.value = false;
  if (key === "delete") {
    handleDelete();
  }
}
async function handleDelete() {
  const path = currentFolder.value?.path;
  if (path) {
    settings.value.recycleBin[path] = true;
    await updateSettingsFile();
  }
}
function handleImageOutside() {
  showDropdown.value = false;
  currentFolder.value = null;
}
function handleContextmenuFolder(event: MouseEvent, item: RepoContents[0]) {
  event.preventDefault();
  currentFolder.value = item;
  showDropdown.value = true;
  dropDownPosition.x = event.clientX;
  dropDownPosition.y = event.clientY;
}
</script>
<template>
  <n-scrollbar style="height: 100vh">
    <Header :title="t('folder_manage.title')">
      <template #default>
        <Icon
          icon="material-symbols:arrow-back-ios-rounded"
          class="text-1.2rem cursor-pointer hover:color-primary-200"
          @click="$router.replace('/user')"
        />
      </template>
    </Header>

    <DefineTemplate v-slot="{ $slots, icon, label, iconColor }">
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
      </div>
    </DefineTemplate>

    <div px-16px>
      <div class="title">
        <div flex-1>
          {{ currentPath ? toLocaleUpperCasePath : t("root") }}
          <span
            v-if="currentPath"
            class="text-10px ml-2px color-blue-500 cursor-pointer"
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
          @click="
            () => {
              addUploadPath(item.path);
            }
          "
          @contextmenu="handleContextmenuFolder($event, item)"
        />
      </template>

      <!-- 空文件夹 -->
      <ReusableTemplate
        v-else
        label="Empty"
        icon="ic:round-folder-open"
        icon-color="color-blue-100"
      />
    </div>

    <n-dropdown
      placement="bottom-start"
      trigger="manual"
      :x="dropDownPosition.x"
      :y="dropDownPosition.y"
      :options="FolderDropDownOptions"
      :show="showDropdown"
      @select="handleImageDropDownSelect"
      @clickoutside="handleImageOutside"
    />
  </n-scrollbar>
</template>

<style lang="less" scoped>
.title {
  font-size: 18px;
  font-weight: bold;
  letter-spacing: 1px;
  color: #252525;
  margin: 15px 0 10px 0;
  display: flex;
  align-items: center;
}
</style>
