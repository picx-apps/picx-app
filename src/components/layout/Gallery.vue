<script lang="ts" setup>
import { Icon } from "@iconify/vue";
import { useLibraryState } from "~/store/library";
import { NInput } from "naive-ui";

const [DefineFolder, ReusableFolder] = createReusableTemplate<{
  icon?: string;
  text?: string;
}>();

const name = ref("");
const { t } = useI18n();
const dialog = useDialog();
const { library, imagePath, createLibrary } = useLibraryState();

//TODO I18N
function handleNewFolder() {
  const d = dialog.create({
    title: "Create Library",
    showIcon: false,
    closable: false,
    positiveText: "Confirm",
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
        placeholder: "Please Input Name",
      }),
    onPositiveClick: async () => {
      d.loading = true;
      await createLibrary(name.value);
      name.value = "";
    },
  });
}
</script>

<template>
  <div>
    <Option icon="ph:circles-four-fill" :text="t('home.library')" class="cursor-default">
      <template #optional>
        <n-tooltip placement="top" trigger="hover" v-if="imagePath.length">
          <template #trigger>
            <Icon
              icon="ph:arrow-left-bold"
              class="text-1.3rem mr-10px hover:color-white cursor-pointer"
              @click="() => imagePath.pop()"
            />
          </template>
          <span> Back </span>
        </n-tooltip>
        <n-tooltip placement="top" trigger="hover">
          <template #trigger>
            <Icon icon="ph:plus-bold" class="text-1.3rem hover:color-white cursor-pointer" @click="handleNewFolder" />
          </template>
          <span> New </span>
        </n-tooltip>
      </template>
    </Option>

    <DefineFolder v-slot="{ $slots, text, icon }">
      <div class="flex items-center p-8px rounded-8px cursor-pointer group">
        <Icon :icon="icon ? icon : 'ic:round-folder'" class="text-2rem color-blue-400" />
        <template v-if="$slots.default">
          <component :is="$slots.default" />
        </template>
        <div v-else class="ml-10px color-#989898 group-hover:color-white">{{ text }}</div>
      </div>
    </DefineFolder>

    <template v-if="library.length">
      <ReusableFolder
        v-for="item in library"
        :key="item.sha"
        :text="item.name"
        @click="() => imagePath.push(item.path)"
      />
    </template>

    <template v-else>
      <div class="p-8px color-gray text-center">{{ t("home.library_empty") }}</div>
    </template>
  </div>
</template>

<style lang="less" scoped></style>
~/store/library
