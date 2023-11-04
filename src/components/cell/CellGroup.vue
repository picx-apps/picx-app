<script lang="ts" setup></script>

<template>
  <div class="cell__group">
    <slot></slot>
  </div>
</template>

<style lang="less" scoped>
.cell__group {
  --cell-rounded: 8px;
  width: 100%;
  overflow: hidden;
  border-radius: var(--cell-rounded);
}
</style>
