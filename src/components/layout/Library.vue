<script lang="ts" setup>
import { Icon } from "@iconify/vue";
import { FolderDropDownOptions } from "~/constant";
import { useLibraryState } from "~/store/library";
import { useSettingState } from "~/store/setting";
import { RepoContents } from "~/types";
import { NInput } from "naive-ui";

const [DefineLibrary, ReusableLibrary] = createReusableTemplate<{
  icon?: string;
  text?: string;
}>();

const name = ref("");
const { t } = useI18n();
const router = useRouter();
const dialog = useDialog();
const { library, imagePath, currentPath, createLibrary } = useLibraryState();
const { settings, updateSettingsFile } = useSettingState();
const showDropdown = ref(false);
const dropDownPosition = reactive({
  x: 0,
  y: 0,
});
const currentLibrary = ref<RepoContents[0] | null>(null);

//TODO I18N
function handleNewFolder() {
  const d = dialog.create({
    title: t("home.create_library"),
    showIcon: false,
    closable: false,
    positiveText: t("confirm"),
    positiveButtonProps: {
      type: "primary",
      size: "large",
    },
    content: () =>
      h(NInput, {
        value: name.value,
        onUpdateValue: (value) => {
          name.value = value;
        },
        placeholder: t("home.placeholder"),
      }),
    onPositiveClick: async () => {
      d.loading = true;
      await createLibrary(name.value);
      name.value = "";
    },
  });
}
function handleContextmenuLibrary(event: MouseEvent, item: RepoContents[0]) {
  event.preventDefault();
  // const el = event.currentTarget as HTMLDivElement;
  currentLibrary.value = item;
  showDropdown.value = true;
  dropDownPosition.x = event.clientX;
  dropDownPosition.y = event.clientY;
}
async function handleLibraryDropDownSelect(key: string) {
  showDropdown.value = false;
  if (key === "delete") {
    handleDelete();
  }
  if (key === "share") {
    //TODO
    //使用GitHub page 生成当前文件夹目录下的所有图片的静态站点，再分享
  }
}
async function handleDelete() {
  const path = currentLibrary.value?.path;
  if (path) {
    settings.value.recycleBin[path] = true;
    await updateSettingsFile();
  }
}
function handleLibraryOutside() {
  showDropdown.value = false;
  currentLibrary.value = null;
}
function handleClickLibrary(value: string) {
  imagePath.value.push(value);
  router.push({ name: "home", query: { path: currentPath.value } });
}
function handleBackLibrary() {
  imagePath.value.pop();
  router.push({ name: "home", query: { path: currentPath.value } });
}
</script>

<template>
  <div class="h-full flex flex-col">
    <Option icon="ph:circles-four-fill" :text="t('home.library')" class="cursor-default">
      <template #text>
        <span class="cursor-pointer hover:color-white" @click="imagePath = []">{{ t("home.library") }}</span>
      </template>
      <template #optional>
        <n-tooltip placement="top" trigger="hover" v-if="imagePath.length">
          <template #trigger>
            <Icon
              icon="ph:arrow-left-bold"
              class="text-1.3rem mr-10px hover:color-white cursor-pointer"
              @click="handleBackLibrary"
            />
          </template>
          <span> {{ t("back") }} </span>
        </n-tooltip>
        <n-tooltip placement="top" trigger="hover">
          <template #trigger>
            <Icon icon="ph:plus-bold" class="text-1.3rem hover:color-white cursor-pointer" @click="handleNewFolder" />
          </template>
          <span> {{ t("home.new") }} </span>
        </n-tooltip>
      </template>
    </Option>

    <n-scrollbar class="flex-1">
      <DefineLibrary v-slot="{ $slots, text, icon }">
        <div
          class="flex items-center p-8px rounded-8px cursor-pointer group select-none hover:bg-#1d1d1d transition-all duration-50"
        >
          <Icon :icon="icon ? icon : 'ic:round-folder'" class="text-3rem color-blue-400" />
          <template v-if="$slots.default">
            <component :is="$slots.default" />
          </template>
          <div v-else class="ml-10px color-#989898 group-hover:color-white">{{ text }}</div>
        </div>
      </DefineLibrary>

      <template v-if="library.length">
        <ReusableLibrary
          v-for="item in library"
          :key="item.sha"
          :text="item.name"
          @click="handleClickLibrary(item.path)"
          @contextmenu="handleContextmenuLibrary($event, item)"
        />
      </template>

      <template v-else>
        <div class="p-8px color-gray text-center">{{ t("home.library_empty") }}</div>
      </template>
    </n-scrollbar>

    <n-dropdown
      placement="bottom-start"
      trigger="manual"
      show-arrow
      :x="dropDownPosition.x"
      :y="dropDownPosition.y"
      :options="FolderDropDownOptions"
      :show="showDropdown"
      @select="handleLibraryDropDownSelect"
      @clickoutside="handleLibraryOutside"
    />
  </div>
</template>
