<script setup lang="ts">
import { useRouteState } from "./store/route";
import { useSettingState } from "./store/setting";
import { themeOverrides } from "./theme";
import { useGlobalState } from "~/store";
import hljs from "highlight.js/lib/core";
import json from "highlight.js/lib/languages/json";
import { darkTheme } from "naive-ui";

hljs.registerLanguage("json", json);
const route = useRoute();
const { addHistory } = useRouteState();

watch(route, (value) => {
  addHistory(value.path);
});

onMounted(() => {
  useGlobalState().initState();
  useSettingState().autoCreateOfSettings();
  // useEventListener(document, "contextmenu", (e) => e.preventDefault());
});
</script>

<template>
  <RouterView v-slot="{ Component }">
    <template v-if="Component">
      <n-config-provider :theme-overrides="themeOverrides" :hljs="hljs" :theme="darkTheme">
        <n-notification-provider>
          <n-message-provider>
            <n-dialog-provider>
              <!-- <n-theme-editor> -->
              <KeepAlive>
                <Suspense>
                  <!-- 主要内容 -->
                  <div>
                    <LayoutHeader />
                    <component :is="Component"></component>
                  </div>
                  <!-- 加载中状态 -->
                  <template #fallback> 正在加载... </template>
                </Suspense>
              </KeepAlive>
              <!-- </n-theme-editor> -->
            </n-dialog-provider>
          </n-message-provider>
        </n-notification-provider>
      </n-config-provider>
    </template>
  </RouterView>
</template>
