<script lang="ts" setup>
const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const menuInstance = ref<HTMLDivElement>();
const { height } = useElementSize(menuInstance);
const menu = computed(() => [
  {
    icon: "ph:house-fill",
    name: "home",
    text: t("home.title"),
  },
  {
    icon: "majesticons:cloud-upload",
    name: "upload",
    text: t("node.title"),
  },
  // {
  //   icon: "mdi:account-circle",
  //   name: "user",
  //   text: t("user.title"),
  // },
]);
</script>

<template>
  <!-- 菜单 -->
  <div class="bg-#131313 px-10px py-10px rounded-8px" ref="menuInstance">
    <Option
      v-for="item in menu"
      :key="item.name"
      :icon="item.icon"
      :text="item.text"
      :is-current="route.name === item.name"
      @click="() => router.push({ name: item.name })"
      class="hover:color-white cursor-pointer my-4px"
    />
  </div>

  <!-- 文件夹 -->
  <div
    class="folder bg-#131313 px-10px py-10px rounded-8px mt-10px"
    :style="{
      height: `calc(100% - ${height + 30}px)`,
    }"
  >
    <LayoutLibrary />
  </div>
</template>

<style lang="less" scoped></style>
