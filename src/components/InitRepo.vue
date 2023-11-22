<script lang="ts" setup>
import { Icon } from "@iconify/vue";

const props = defineProps<{
  modelValue: boolean | undefined;
}>();
const emit = defineEmits(["update:modelValue"]);
const modelValue = useVModel(props, "modelValue", emit);
const [DefineTemplate, ReuseTemplate] = createReusableTemplate<{
  icon: string;
  title: string;
  label: string;
  value?: string;
}>();
const { t } = useI18n();
</script>

<template>
  <DefineTemplate v-slot="{ icon, title, label, value }">
    <div
      class="flex items-center cursor-pointer rounded-10px hover:bg-#fafafa dark:hover:bg-gray-7 px-10px py-12px mb-10px"
    >
      <Icon :icon="icon" class="w-40px h-40px color-#aaaaaa" />
      <div class="flex-1 ml-20px">
        <div class="text-1rem font-600 color-#5d5d5d dark:color-white">
          {{ title }}
        </div>
        <div class="text-10px color-#757575">{{ label }}</div>
      </div>
      <div class="flex items-center">
        <span class="text-1rem mr-10px color-#2f2f2f font-600">{{ value }}</span>
        <Icon icon="material-symbols:arrow-forward-ios-rounded" class="color-#545454" />
      </div>
    </div>
  </DefineTemplate>

  <div class="mt-20px">
    <div class="my-20px color-#aaaaaa">{{ t("init.init_repo") }}</div>
  </div>
  <div class="w-full">
    <ReuseTemplate
      icon="fluent-emoji:beaming-face-with-smiling-eyes"
      :title="t('yes')"
      :label="t('init.yes_read')"
      @click="modelValue = true"
    ></ReuseTemplate>
    <ReuseTemplate
      icon="fluent-emoji:knocked-out-face"
      :title="t('no')"
      :label="t('init.no_read')"
      @click="modelValue = false"
    ></ReuseTemplate>
  </div>
</template>

<style lang="less" scoped>
.option {
  cursor: pointer;
  &:hover .icon,
  &:hover .text,
  &.active .icon,
  &.active .text {
    color: #ffab4e;
  }
}
</style>
