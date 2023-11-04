<script lang="ts" setup>
import { Icon } from "@iconify/vue";

const props = defineProps<{
  modelValue: boolean | undefined;
}>();
const emit = defineEmits(["update:modelValue"]);
const modelValue = useVModel(props, "modelValue", emit);
const notification = useNotification();
const [DefineOption, ReuseOption] = createReusableTemplate<{
  icon: string;
  label: string;
  value: boolean;
}>();

function validate() {
  if (modelValue.value === undefined) {
    notification.warning({
      content: "Please select an option",
      duration: 1000,
    });
    return false;
  }
  return true;
}

defineExpose({
  validate,
});
</script>

<template>
  <DefineOption v-slot="{ icon, label, value }">
    <div
      class="text-center option"
      :class="[modelValue === value && 'active']"
      @click="modelValue = value"
    >
      <div
        class="bg-#F4F4F4 w-100px h-100px rounded-14px flex items-center justify-center mx-18px"
      >
        <Icon :icon="icon" class="text-3rem color-#525252 icon" />
      </div>
      <div class="text-1.1rem mt-10px font-bold text">{{ label }}</div>
    </div>
  </DefineOption>

  <div class="flex flex-col items-center justify-center mt-20px">
    <div class="my-20px color-#aaaaaa">你准备好仓库了吗?</div>
    <div class="flex items-center justify-center">
      <!-- yes -->
      <ReuseOption
        icon="icon-park-solid:grinning-face-with-squinting-eyes"
        label="Yes"
        :value="true"
      />

      <!-- no -->
      <ReuseOption
        icon="icon-park-solid:grinning-face-with-tightly-closed-eyes-open-mouth"
        label="No"
        :value="false"
      />
    </div>
  </div>
</template>

<style lang="less" scoped>
.option {
  cursor: pointer;
  &:hover .icon,
  &:hover .text,
  &.active .icon,
  &.active .text {
    color: #ffb939;
  }
}
</style>
