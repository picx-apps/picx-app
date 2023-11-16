<script lang="ts" setup>
import { Icon } from "@iconify/vue";
import { useWatermarkState } from "../../store/watermark";

const { t } = useI18n();
const { watermark: form } = useWatermarkState();
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

    <div class="px-16px">
      <n-form
        ref="formRef"
        :label-width="50"
        :model="form"
        label-placement="top"
      >
        <n-form-item path="text">
          <template #label>
            <div class="flex items-center">
              <Icon icon="fluent-emoji:bagel" class="text-1.3rem mr-6px" />
              <span>{{ t("watermark.watermark_text") }}</span>
            </div>
          </template>
          <n-input v-model:value="form.text" />
        </n-form-item>
        <n-form-item path="top">
          <template #label>
            <div class="flex items-center">
              <Icon
                icon="fluent-emoji:backhand-index-pointing-up-light"
                class="text-1.3rem mr-6px"
              />
              <span>{{ t("watermark.top") }}</span>
            </div>
          </template>
          <n-input-number v-model:value="form.top" class="w-full" />
        </n-form-item>
        <n-form-item path="left">
          <template #label>
            <div class="flex items-center">
              <Icon
                icon="fluent-emoji:backhand-index-pointing-right-light"
                class="text-1.3rem mr-6px"
              />
              <span>{{ t("watermark.left") }}</span>
            </div>
          </template>
          <n-input-number v-model:value="form.left" class="w-full" />
        </n-form-item>
        <n-form-item path="size">
          <template #label>
            <div class="flex items-center">
              <Icon
                icon="fluent-emoji:call-me-hand-light"
                class="text-1.3rem mr-6px"
              />
              <span>{{ t("watermark.size") }}</span>
            </div>
          </template>
          <n-input-number v-model:value="form.size" class="w-full" />
        </n-form-item>
        <n-form-item path="fontColor">
          <template #label>
            <div class="flex items-center">
              <Icon
                icon="fluent-emoji:artist-palette"
                class="text-1.3rem mr-6px"
              />
              <span>{{ t("watermark.font_color") }}</span>
            </div>
          </template>
          <n-color-picker v-model:value="form.fontColor" />
        </n-form-item>
        <n-form-item path="backgroundColor">
          <template #label>
            <div class="flex items-center">
              <Icon
                icon="fluent-emoji:artist-palette"
                class="text-1.3rem mr-6px"
              />
              <span>{{ t("watermark.background_color") }}</span>
            </div>
          </template>
          <n-color-picker v-model:value="form.backgroundColor" />
        </n-form-item>
        <n-form-item :label="t('watermark.opacity')" path="opacity">
          <template #label>
            <div class="flex items-center">
              <Icon icon="fluent-emoji:cold-face" class="text-1.3rem mr-6px" />
              <span>{{ t("watermark.opacity") }}</span>
            </div>
          </template>
          <n-input-number
            v-model:value="form.opacity"
            class="w-full"
            :step="0.1"
            :min="0"
            :max="1"
          />
        </n-form-item>
      </n-form>

      <n-button type="primary" ghost class="w-full" @click="">
        {{ t("repositories.complete") }}
      </n-button>
    </div>
  </n-scrollbar>
</template>

<style lang="less" scoped></style>
