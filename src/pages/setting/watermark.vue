<script lang="ts" setup>
import { useWatermarkState, Watermark } from "../../store/watermark";
import { Icon } from "@iconify/vue";

const { t } = useI18n();
const { watermark } = useWatermarkState();
const form = reactive<Watermark>({ ...watermark.value });
const isUpdater = computed(() =>
  Object.keys(form).some((key) => form[key as keyof typeof form] !== watermark.value[key as keyof typeof form]),
);
</script>

<template>
  <n-scrollbar style="height: 100vh">
    <Header :title="t('watermark.title')">
      <template #default>
        <Icon
          icon="material-symbols:arrow-back-ios-rounded"
          class="text-1.2rem cursor-pointer hover:color-primary-200"
          @click="$router.replace('/user')"
        />
      </template>
    </Header>

    <div class="px-26px">
      <div class="option">
        <div class="flex flex-col">
          <span class="text-.9rem color-gray-6">{{ $t("watermark.enable") }}</span>
          <span class="text-.8rem color-gray-4">{{ $t("watermark.enable_info") }}</span>
        </div>
        <n-switch v-model:value="form.enable"></n-switch>
      </div>

      <n-form ref="formRef" :label-width="50" :model="form" label-placement="top" class="pt-10px">
        <n-form-item path="text">
          <template #label>
            <div class="flex items-center">
              <!-- <Icon icon="fluent-emoji:bagel" class="text-1.3rem mr-6px" /> -->
              <span>{{ t("watermark.watermark_text") }}</span>
            </div>
          </template>
          <n-input v-model:value="form.text" />
        </n-form-item>
        <n-form-item path="fontColor">
          <template #label>
            <div class="flex items-center">
              <!-- <Icon
                icon="fluent-emoji:artist-palette"
                class="text-1.3rem mr-6px"
              /> -->
              <span>{{ t("watermark.font_color") }}</span>
            </div>
          </template>
          <n-color-picker v-model:value="form.fontColor" />
        </n-form-item>
        <n-form-item path="size">
          <template #label>
            <div class="flex items-center">
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
            <div class="flex items-center">
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
            <div class="flex items-center">
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

      <n-button type="primary" ghost class="w-full" @click="watermark = { ...form }" v-show="isUpdater">
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
  cursor: pointer;
  border-radius: 0.5rem;
}
</style>
