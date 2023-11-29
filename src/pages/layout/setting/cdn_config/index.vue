<script lang="ts" setup>
import { Icon } from "@iconify/vue";
import { useSettingState } from "~/store/setting";

const { t } = useI18n();
const { settings, currentCDN, removeCDN, setCurrentCDN } = useSettingState();
const [DefineOption, ReuseOption] = createReusableTemplate<{
  icon: string;
  title?: string;
  label?: string;
  isDefault?: boolean;
}>();
const notification = useNotification();
const defaultCDN = computed(() => settings.value.cdn.filter((item) => item.isDefault === true));
const customCDN = computed(() => settings.value.cdn.filter((item) => !item.isDefault));

function handleDelete(key?: string) {
  if (!key) return;
  if (key === currentCDN.value?.key) {
    return notification.warning({
      content: t("cdn_config.no_delete_current"),
      duration: 1000,
    });
  }
  removeCDN(key);
}
</script>

<route lang="yaml">
name: cdn_config
</route>

<template>
  <n-scrollbar style="height: 100vh">
    <Header :title="$t('cdn_config.title')">
      <template #default>
        <Icon
          icon="material-symbols:arrow-back-ios-rounded"
          class="text-1.2rem cursor-pointer hover:color-primary-200"
          @click="$router.replace({ name: 'user' })"
        />
      </template>
      <template #optional>
        <Icon
          icon="ic:baseline-plus"
          class="text-1.5rem cursor-pointer hover:color-primary-200"
          @click="$router.push({ name: 'cdn_updater' })"
        />
      </template>
    </Header>

    <DefineOption v-slot="{ icon, title, label, isDefault }">
      <div
        class="flex items-center cursor-pointer rounded-10px hover:bg-#1d1d1d transition-all duration-50 px-10px py-12px mb-10px"
      >
        <Icon :icon="icon" class="w-25px h-25px color-#aaaaaa" />
        <div class="flex-1 ml-10px truncate">
          <div class="text-1rem font-600 color-#5d5d5d dark:color-white">
            {{ title }}
          </div>
          <div class="text-10px color-#757575 truncate">{{ label }}</div>
        </div>
        <div v-show="!isDefault">
          <Icon
            icon="material-symbols:delete"
            class="text-1.2rem color-#8c8c8c dark:color-white hover:color-#487aef cursor-pointer"
            @click="handleDelete(title)"
          />
        </div>
      </div>
    </DefineOption>

    <div class="px-16px">
      <div class="option">
        <div class="flex flex-col w-full">
          <span class="text-.9rem color-gray-6 dark:color-white mb-10px">
            {{ t("cdn_config.current") }}
          </span>
          <div>
            <ReuseOption
              icon="fluent-emoji:globe-showing-europe-africa"
              :title="currentCDN?.key"
              :label="currentCDN?.value"
              :is-default="true"
            />
          </div>
        </div>
      </div>

      <!-- 默认 -->
      <div class="option">
        <div class="flex flex-col w-full">
          <div class="text-.9rem color-gray-6 dark:color-white mb-10px">
            {{ t("default") }}
          </div>
          <div>
            <ReuseOption
              v-for="item in defaultCDN"
              icon="fluent-emoji:globe-showing-europe-africa"
              :key="item.key"
              :title="item.key"
              :label="item.value"
              :is-default="true"
              @click="() => setCurrentCDN(item.key)"
            />
          </div>
        </div>
      </div>

      <!-- 自定义 -->
      <div class="option" v-show="customCDN.length">
        <div class="flex flex-col w-full">
          <div class="text-.9rem color-gray-6 dark:color-white mb-10px">
            {{ t("custom") }}
          </div>
          <div>
            <ReuseOption
              v-for="item in customCDN"
              icon="fluent-emoji:globe-showing-europe-africa"
              :key="item.key"
              :title="item.key"
              :label="item.value"
              :is-default="item.isDefault"
              @click="() => setCurrentCDN(item.key)"
            />
          </div>
        </div>
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
  width: 100%;
}
</style>
