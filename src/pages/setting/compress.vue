<script lang="ts" setup>
import { CompressionQuality } from "../../enum";
import { useGlobalState } from "../../store";
import { Icon } from "@iconify/vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n({
  messages: {
    "en-US": {
      Default: "Default",
      Fast: "Fast",
      Best: "Best",
    },
    "zh-CN": {
      Default: "默认",
      Fast: "快速",
      Best: "最佳",
    },
  },
});
const { compress } = useGlobalState();
const [DefineTemplate, ReuseTemplate] = createReusableTemplate<{
  label: CompressionQuality;
  value: keyof typeof CompressionQuality;
}>();

watchEffect(() => {
  console.log("compress", compress.value.enable);
});
</script>

<template>
  <n-scrollbar style="height: 100vh">
    <Header :title="$t('compress.title')">
      <template #default>
        <Icon
          icon="material-symbols:arrow-back-ios-rounded"
          class="text-1.2rem cursor-pointer hover:color-primary-200"
          @click="$router.replace('/user')"
        />
      </template>
    </Header>

    <DefineTemplate v-slot="{ label, value }">
      <div class="transition-all hover:bg-#f7f7f7 dark:hover:bg-gray-7 option">
        <div class="text-.9rem color-gray-6 dark:color-white">
          {{ t(label) }}
        </div>
        <Icon icon="charm:tick" class="color-primary text-1rem" v-if="compress.compress_type === value" />
      </div>
    </DefineTemplate>

    <div class="px-16px">
      <div class="option">
        <div class="flex flex-col">
          <span class="text-.9rem color-gray-6 dark:color-white">{{ $t("compress.enable") }}</span>
          <span class="text-.8rem color-gray-4">{{ $t("compress.enable_info") }}</span>
        </div>
        <n-switch v-model:value="compress.enable"></n-switch>
      </div>

      <div v-show="compress.enable">
        <ReuseTemplate
          v-for="(item, key) in CompressionQuality"
          :key="key"
          :label="item"
          :value="key"
          @click="() => (compress.compress_type = key)"
        />
      </div>
    </div>
  </n-scrollbar>
</template>

<style lang="less" scoped>
.option {
  padding: 6px 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  border-radius: 0.5rem;
}
</style>
