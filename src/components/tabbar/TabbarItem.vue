<script lang="ts" setup>
const props = defineProps<{
  name: string;
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
    <slot></slot>
  </div>
</template>

<style lang="less" scoped>
.tabbar-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-radius: 100%;
  padding: 8px;
  color: white;
  transform: scale(1);
  cursor: pointer;
  &:active {
    transform: scale(0.95, 0.95);
  }
}
.tabbar-item.current {
  transform: scale(1.1, 1.1);
  color: rgb(72, 122, 239);
}

.tabbar-item:last-child {
  margin: 0;
}
</style>
