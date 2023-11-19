<script lang="ts" setup>
const props = defineProps<{
  name: string;
  text: string;
}>();
const route = useRoute();
const isActive = computed(() => route.name === props.name);
</script>

<template>
  <div
    class="tabbar-item"
    :class="[isActive && 'current']"
    @click="
      () => {
        $router.push({ name });
      }
    "
  >
    <div class="h-24px">
      <slot></slot>
    </div>
    <div class="tabbar-item__text">
      {{ text }}
    </div>
  </div>
</template>

<style lang="less" scoped>
.tabbar-item__text,
.tabbar-item {
  color: var(--tabbar-item-color);
}
.tabbar-item {
  border-radius: 100%;
  padding: 0 8px;
  transform: scale(1);
  cursor: pointer;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  &:active {
    transform: scale(0.95, 0.95);
  }
}
.tabbar-item.current {
  transform: scale(1.1, 1.1);
  color: var(--tabbar-item-color-active);
  .tabbar-item__text {
    color: var(--tabbar-item-color-active);
  }
}

.tabbar-item:last-child {
  margin: 0;
}
.tabbar-item__text {
  font-size: 11px;
  letter-spacing: 1px;
  font-weight: bold;
  text-align: center;
}
</style>
