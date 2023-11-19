<script lang="ts" setup>
import { Icon } from "@iconify/vue";
import { messageOptions, language } from "../../language";
const { t } = useI18n();
const [DefineTemplate, ReuseTemplate] = createReusableTemplate<{
  label: string;
  value: string;
}>();
</script>

<template>
  <n-scrollbar style="height: 100vh">
    <Header :title="t('language.title')">
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
        <Icon
          icon="charm:tick"
          class="color-primary text-1rem"
          v-if="value === language"
        />
      </div>
    </DefineTemplate>

    <div class="px-16px">
      <ReuseTemplate
        v-for="item in messageOptions"
        v-bind="item"
        @click="
          () => {
            language = item.value as any
            $i18n.locale = item.value;
          }
        "
      />
    </div>
  </n-scrollbar>
</template>

<style lang="less" scoped></style>
