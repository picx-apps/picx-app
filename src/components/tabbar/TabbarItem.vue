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
    <div class="h-20px w-20px">
      <slot></slot>
    </div>
    <div class="tabbar-item__text">
      {{ text }}
    </div>
  </div>
</template>

<style lang="less" scoped>
.tabbar-item {
  border-radius: 100%;
  padding: 0 8px;
  color: var(--text-primary);
  transform: scale(1);
  cursor: pointer;
  &:active {
    transform: scale(0.95, 0.95);
  }
}
.tabbar-item.current {
  transform: scale(1.1, 1.1);
  color: rgb(72, 122, 239);
  .tabbar-item__text {
    color: rgb(72, 122, 239);
  }
}

.tabbar-item:last-child {
  margin: 0;
}
.tabbar-item__text {
  font-size: 10px;
  color: var(--text-primary);
  letter-spacing: 1px;
}
</style>
