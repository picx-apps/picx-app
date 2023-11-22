<script lang="ts" setup>
import { Icon } from "@iconify/vue";

const { t } = useI18n();
const [DefineTemplate, ReuseTemplate] = createReusableTemplate<{
  label: string;
  value: boolean;
}>();
const themeOptions = [
  {
    label: t("theme.light"),
    value: false,
  },
  {
    label: t("theme.dark"),
    value: true,
  },
];
</script>

<template>
  <n-scrollbar style="height: 100vh">
    <Header :title="t('theme.title')">
      <template #default>
        <Icon
          icon="material-symbols:arrow-back-ios-rounded"
          class="text-1.2rem cursor-pointer hover:color-primary-200"
          @click="$router.replace('/user')"
        />
      </template>
    </Header>

    <DefineTemplate v-slot="{ label, value }">
      <div
        class="transition-all px-10px py-6px flex items-center justify-between cursor-pointer hover:bg-#f7f7f7 dark:hover:bg-gray-7 rounded-lg"
      >
        <div class="text-.9rem color-gray-6 dark:color-white">{{ label }}</div>
        <Icon icon="charm:tick" class="color-primary text-1rem" v-if="value === isDark" />
      </div>
    </DefineTemplate>

    <div class="px-16px">
      <ReuseTemplate
        v-for="item in themeOptions"
        :key="item.label"
        v-bind="item"
        @click="
          () => {
            toggleDark(item.value);
          }
        "
      />
    </div>
  </n-scrollbar>
</template>
