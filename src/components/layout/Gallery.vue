<script lang="ts" setup>
import { Icon } from "@iconify/vue";
import { useGalleryState } from "~/store/gallery";

const [DefineFolder, ReusableFolder] = createReusableTemplate<{
  icon?: string;
  text: string;
}>();

const { t } = useI18n();
const { gallery, imagePath } = useGalleryState();
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
            <Icon icon="ph:plus-bold" class="text-1.3rem hover:color-white cursor-pointer" />
          </template>
          <span> New </span>
        </n-tooltip>
      </template>
    </Option>

    <DefineFolder v-slot="{ text, icon }">
      <div class="flex items-center p-8px rounded-8px cursor-pointer group">
        <Icon :icon="icon ? icon : 'ic:round-folder'" class="text-2rem color-blue-400" />
        <div class="ml-10px color-#989898 group-hover:color-white">{{ text }}</div>
      </div>
    </DefineFolder>

    <template v-if="gallery.length">
      <ReusableFolder
        v-for="item in gallery"
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
