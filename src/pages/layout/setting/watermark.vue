<script lang="ts" setup>
import { Icon } from "@iconify/vue";
import { useSettingState, Watermark } from "~/store/setting";

const { t } = useI18n();
const { settings, setWatermark } = useSettingState();
const form = reactive<Watermark>({ ...settings.value.watermark });
const isUpdater = computed(() =>
  Object.keys(form).some(
    (key) => form[key as keyof typeof form] !== settings.value.watermark[key as keyof typeof form],
  ),
);
</script>

<route lang="yaml">
name: watermark_manage
</route>

<template>
  <n-scrollbar style="height: 100vh">
    <Header :title="t('watermark.title')">
      <template #default>
        <Icon
          icon="material-symbols:arrow-back-ios-rounded"
          class="text-1.2rem cursor-pointer hover:color-primary-200"
          @click="$router.replace({ name: 'user' })"
        />
      </template>
    </Header>

    <div class="px-26px">
      <div class="option">
        <div class="flex flex-col">
          <span class="text-1rem color-white font-bold mb-6px">{{ $t("watermark.enable") }}</span>
          <span class="text-.8rem color-gray-4">{{ $t("watermark.enable_info") }}</span>
        </div>
        <n-switch v-model:value="form.enable"></n-switch>
      </div>

      <n-form ref="formRef" :label-width="50" :model="form" label-placement="top" class="pt-10px">
        <n-form-item path="text">
          <template #label>
            <div class="flex items-center text-1.1rem mb-6px font-bold">
              <!-- <Icon icon="fluent-emoji:bagel" class="text-1.3rem mr-6px" /> -->
              <span>{{ t("watermark.watermark_text") }}</span>
            </div>
          </template>
          <n-input v-model:value="form.text" />
        </n-form-item>
        <n-form-item path="fontColor">
          <template #label>
            <div class="flex items-center text-1.1rem mb-6px font-bold">
              <!-- <Icon
                icon="fluent-emoji:artist-palette"
                class="text-1.3rem mr-6px"
              /> -->
              <span>{{ t("watermark.font_color") }}</span>
            </div>
          </template>
          <n-color-picker v-model:value="form.fontColor" :show-alpha="false" />
        </n-form-item>
        <n-form-item path="size">
          <template #label>
            <div class="flex items-center text-1.1rem mb-6px font-bold">
              <!-- <Icon
                icon="fluent-emoji:call-me-hand-light"
                class="text-1.3rem mr-6px"
              /> -->
              <span>{{ t("watermark.size") }}</span>
            </div>
          </template>
          <n-input-number v-model:value="form.size" class="w-full" />
        </n-form-item>
        <n-form-item path="top">
          <template #label>
            <div class="flex items-center text-1.1rem mb-6px font-bold">
              <!-- <Icon
                icon="fluent-emoji:backhand-index-pointing-up-light"
                class="text-1.3rem mr-6px"
              /> -->
              <span>{{ t("watermark.top") }}</span>
            </div>
          </template>
          <n-input-number v-model:value="form.top" class="w-full" />
        </n-form-item>
        <n-form-item path="left">
          <template #label>
            <div class="flex items-center text-1.1rem mb-6px font-bold">
              <!-- <Icon
                icon="fluent-emoji:backhand-index-pointing-right-light"
                class="text-1.3rem mr-6px"
              /> -->
              <span>{{ t("watermark.left") }}</span>
            </div>
          </template>
          <n-input-number v-model:value="form.left" class="w-full" />
        </n-form-item>
      </n-form>

      <n-button type="primary" class="w-full" @click="() => setWatermark(form)" v-show="isUpdater">
        {{ t("repositories.complete") }}
      </n-button>
    </div>
  </n-scrollbar>
</template>

<style lang="less" scoped>
.option {
  padding: 6px 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-radius: 0.5rem;
}
</style>
