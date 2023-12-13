<script lang="ts" setup>
import image from "../assets/images/install.png?url";
import { Icon } from "@iconify/vue";
import { open } from "@tauri-apps/api/shell";
import { useGlobalState } from "~/store";

const { t } = useI18n();
const router = useRouter();
const { onInstallation } = useGlobalState();

async function handleInstall() {
  onInstallation()
    .then(() => {
      router.replace({ name: "lead" });
    })
    .catch(() => {
      open(import.meta.env.VITE_INSTALL_URL + "/installations/new");
      router.replace("/installation_callback");
    });
}
</script>

<route lang="yaml">
name: installations
</route>

<template>
  <div h-100vh class="login-container">
    <div class="pt-100px text-center">
      <div class="mb-30px w-full flex flex-col items-center">
        <n-image :src="image" width="200" />
        <div class="my-4px text-2rem font-bold lh-38px color-#545454 base-text-color">
          {{ t("login.install_app") }}
        </div>
        <p class="my-0 color-gray">{{ t("login.install-detail") }}</p>
      </div>

      <div>
        <n-button quaternary class="w-300px h-45px login-button" @click="handleInstall">
          <Icon icon="mdi:github" class="text-20px mr-10px" />
          <span class="max-w-120px"> {{ t("login.install") }} </span>
        </n-button>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.login-container {
  padding: 0 30px;
}
.login-button {
  background: linear-gradient(120deg, #5ee6dd, #9ea5ff, #e491fd);
  color: white;
  &:hover {
    color: white;
  }
}
</style>
