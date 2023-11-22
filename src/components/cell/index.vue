<script lang="ts" setup>
import { Icon } from "@iconify/vue";

defineProps<{
  icon?: string | null;
  isLink?: boolean | null;
  title?: string | null;
  label?: string | null;
  value?: string | null;
  linkIcon?: string | null;
}>();
defineSlots<{ prefix: void; suffix: void }>();
</script>

<template>
  <div class="cell">
    <slot name="prefix">
      <Icon class="cell__icon" v-if="icon" :icon="icon" />
    </slot>
    <div class="cell__title">
      <span>{{ title }}</span>
      <div class="cell__label">{{ label }}</div>
    </div>
    <div class="cell__value">{{ value }}</div>
    <slot name="suffix">
      <Icon
        class="cell__link"
        v-if="isLink"
        :icon="linkIcon ? linkIcon : 'material-symbols:arrow-forward-ios-rounded'"
      />
    </slot>
  </div>
</template>

<style lang="less" scoped>
.cell {
  --cell-bg: #fff;
  --cell-value-color: #969799;
  --cell-title-color: #333;
  --cell-label-color: #909090;
  --cell-icon-color: #676767;
  --cell-border-color: #ffffff;
  --cell-link-icon-color: #969799;
  --cell-bg-color-hover: #f5f5f5;
  --cell-link-icon-size: 16px;
  --cell-value-size: 16px;
  --cell-title-size: 14px;
  --cell-icon-size: 30px;
  --cell-padding-x: 16px;
  --cell-padding-y: 10px;
  display: flex;
  align-items: center;
  width: 100%;
  padding: var(--cell-padding-y) var(--cell-padding-x);
  background: var(--cell-bg);
  cursor: pointer;
  & + & {
    border-top: 1px solid var(--cell-border-color);
  }
  &:hover {
    background: var(--cell-bg-color-hover);
  }
  .cell__icon {
    font-size: var(--cell-icon-size);
    color: var(--cell-icon-color);
    margin-right: 10px;
  }
  .cell__title {
    flex: 1;
    color: var(--cell-title-color);
    font-size: var(--cell-title-size);
    max-width: 50%;
  }
  .cell__title .cell__label {
    font-size: 12px;
    color: var(--cell-label-color);
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    width: inherit;
  }
  .cell__value {
    flex: 1;
    text-align: right;
    color: var(--cell-value-color);
    font-size: var(--cell-value-size);
    font-weight: bold;
    line-height: 20px;
  }
  .cell__link {
    margin-left: 6px;
    color: var(--cell-link-icon-color);
    font-size: var(--cell-link-icon-size);
    line-height: 20px;
  }
}
</style>
