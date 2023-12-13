<script lang="ts" setup>
import { Icon } from "@iconify/vue";

defineProps<{
  icon: string;
  text: string;
  isCurrent?: boolean;
}>();
defineSlots<{ optional: void; text: void }>();
</script>

<template>
  <div class="menu-item color-#989898 p-8px rounded-8px flex items-center" :class="[isCurrent && 'current']">
    <div class="flex items-center flex-1">
      <Icon :icon="icon" class="text-1.5rem" />
      <span class="ml-16px font-bold text-1.05rem tracking-wider">
        <slot name="text">
          {{ text }}
        </slot>
      </span>
    </div>
    <div class="flex items-center">
      <slot name="optional" />
    </div>
  </div>
</template>

<style scoped>
.menu-item.current {
  color: white;
}
</style>
