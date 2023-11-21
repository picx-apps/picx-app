<script lang="ts" setup>
import { Icon } from "@iconify/vue";
import { FormInst, FormItemRule, FormRules } from "naive-ui";
import { language } from "~/language";
import { CDN, useSettingState } from "~/store/setting";

const router = useRouter();
const { t } = useI18n();
const { settings, addCDN } = useSettingState();
const formInstance = ref<FormInst>();
const notification = useNotification();
const [form, reset] = useResetRef<CDN>({
  key: "",
  value: "",
});
const message = computed(() =>
  language.value === "zh-CN"
    ? "可使用的变量 owner(作者), repo(仓库名), branch(分支名), path(文件路径)。变量名用{{}}包裹, 例如{{owner}}"
    : "Available variables owner (author), repo (warehouse name), branch (branch name), path (file path). Wrap the variable name in {{}}, for example {{owner}}"
);
const rules = reactive<FormRules>({
  key: [
    {
      required: true,
      trigger: "blur",
      message: t("cdn_config.placeholder_key"),
    },
    {
      min: 1,
      max: 20,
      trigger: "blur",
      validator: (_rule: FormItemRule, value: string) => {
        const index = settings.value.cdn.findIndex(
          (item) => item.key === value
        );
        if (index !== -1) {
          return new Error(t("cdn_config.placeholder_key_exist"));
        }

        return true;
      },
    },
  ],
  value: [
    {
      required: true,
      trigger: "blur",
      message: t("cdn_config.placeholder_value"),
    },
  ],
});

function handleValidateClick(e: MouseEvent) {
  e.preventDefault();
  formInstance.value?.validate((errors) => {
    if (!errors) {
      addCDN(form.value.key, form.value.value);
      notification.success({ content: "Success" });
      router.replace("/setting/cdn_config");
      reset();
    } else {
      console.log(errors);
    }
  });
}
</script>

<route lang="yaml">
name: cdn_updater
</route>

<template>
  <n-scrollbar style="height: 100vh">
    <Header :title="$t('cdn_config.title')">
      <template #default>
        <Icon
          icon="material-symbols:arrow-back-ios-rounded"
          class="text-1.2rem cursor-pointer hover:color-primary-200"
          @click="$router.replace({ name: 'cdn_config' })"
        />
      </template>
    </Header>

    <div class="px-16px">
      <div class="mb-20px">
        <span class="dark:color-gray-6">
          {{ message }}
        </span>
      </div>

      <n-form :model="form" ref="formInstance" :rules="rules">
        <n-form-item path="key" :label="t('cdn_config.key')">
          <n-input
            v-model:value="form.key"
            @keydown.enter.prevent
            :placeholder="t('cdn_config.placeholder_key')"
          />
        </n-form-item>
        <n-form-item path="value" :label="t('cdn_config.value')">
          <n-input
            v-model:value="form.value"
            @keydown.enter.prevent
            :placeholder="t('cdn_config.placeholder_value')"
          />
        </n-form-item>
      </n-form>

      <n-button
        v-show="form.key && form.value"
        attr-type="button"
        type="primary"
        ghost
        class="w-full"
        @click="handleValidateClick"
      >
        {{ t("confirm") }}
      </n-button>
    </div>
  </n-scrollbar>
</template>

<style lang="less" scoped></style>
