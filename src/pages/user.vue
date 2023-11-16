<script lang="ts" setup>
import { Icon } from "@iconify/vue";
import { useGlobalState } from "../store";
const { user } = useGlobalState();

const [DefineTemplate, ReuseTemplate] = createReusableTemplate<{
  icon: string;
  text: string;
}>();
const dialog = useDialog();
const router = useRouter();
const { t } = useI18n();

async function handleSignOut() {
  dialog.warning({
    title: "Sign Out",
    content: "Are you sure you want to sign out?",
    positiveText: "Yes",
    negativeText: "No",
    onPositiveClick: async () => {
      localStorage.clear();
      router.push("/login");
    },
  });
}
</script>

<route lang="yaml">
name: user
</route>

<template>
  <n-scrollbar style="height: 100vh">
    <Header>
      {{ t("user.name") }}
      <template #optional>
        <Icon icon="prime:inbox" class="text-26px ml-6px cursor-pointer" />
      </template>
    </Header>

    <div class="user-container mt-15px">
      <!-- 用户信息 -->
      <div class="flex">
        <n-image
          :src="user?.avatar_url"
          width="80"
          height="80"
          class="rounded-16px mr-20px"
        />
        <div>
          <h2 class="my-0 text-1.4rem lh-20px mb-14px">
            {{ user?.name || user?.login }}
          </h2>
          <div class="my-4px flex color-#8c8c8c text-14px">
            <Icon
              icon="ic:baseline-supervisor-account"
              class="text-1.3rem mr-2px h-20px color-primary-300"
            />
            <span>{{ user?.followers }} followers</span>
            <span
              class="my-9px mx-6px h-3px w-3px rounded-full bg-#8c8c8c"
            ></span>
            <span>{{ user?.following }} following</span>
          </div>
          <div class="my-4px flex color-#cccccc text-12px">
            <Icon
              icon="material-symbols:details-rounded"
              class="text-1.1rem ml-2px mr-5px h-20px color-primary-300"
            />
            <div class="lh-23px">
              {{ user?.bio || "No bio" }}
            </div>
          </div>
        </div>
      </div>

      <DefineTemplate v-slot="{ icon, text }">
        <div
          class="flex items-center py-16px px-10px rounded-10px cursor-pointer hover:bg-#fafafa"
        >
          <div class="flex items-center flex-1">
            <Icon :icon="icon" class="text-1.5rem mr-10px color-#b6b6b6" />
            <div class="text-.9rem font-600 color-#757575">{{ text }}</div>
          </div>
          <Icon
            icon="material-symbols:arrow-forward-ios-rounded"
            class="text-1.2rem color-#b6b6b6"
          />
        </div>
      </DefineTemplate>

      <!-- 设置项 -->
      <div class="mt-30px">
        <ReuseTemplate
          icon="fluent-emoji:bread"
          :text="t('user.repo')"
          @click="router.push('/setting/repo')"
        />
        <ReuseTemplate
          icon="fluent-emoji:bubbles"
          :text="t('user.folder_manage')"
          @click="router.push('/setting/folder_manage')"
        />
        <ReuseTemplate icon="fluent-emoji:ghost" :text="t('user.watermark')" />
        <ReuseTemplate
          icon="fluent-emoji:flexed-biceps"
          :text="t('user.compress')"
          @click="router.push('/setting/compress')"
        />
        <ReuseTemplate
          icon="fluent-emoji:first-quarter-moon"
          :text="t('user.theme')"
        />
        <ReuseTemplate
          icon="fluent-emoji:face-with-peeking-eye"
          :text="t('user.config')"
          @click="router.push('/setting/config')"
        />
        <ReuseTemplate
          icon="fluent-emoji:ab-button-blood-type"
          :text="t('user.language')"
          @click="router.push('/setting/language')"
        />

        <n-button
          class="w-full mt-10px"
          type="error"
          ghost
          @click="() => handleSignOut()"
          >{{ t("sign_out") }}</n-button
        >
      </div>
    </div>

    <Tabbar />
  </n-scrollbar>
</template>

<style lang="less" scoped>
.user-container {
  padding: 0 16px;
  padding-top: 10px;
}
.card-white {
  box-shadow: 0 0 8px 8px #f3f3f3;
  padding: 12px 16px;
  background-color: white;
  color: var(--text-primary);
  border-radius: 10px;
  cursor: pointer;
}
</style>
