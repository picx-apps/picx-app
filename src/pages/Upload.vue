<script lang="ts" setup>
import imgUri from "../assets/images/no-record.png?url";
import { Icon } from "@iconify/vue";
</script>

<route lang="yaml">
name: upload
</route>

<template>
  <n-scrollbar style="height: 100vh">
    <Header>
      <template #optional>
        <Icon
          icon="material-symbols:add-a-photo"
          class="text-2rem cursor-pointer color-#487aef"
        />
        <!-- <n-button quaternary ghost :render-icon="() => h(IcBaselineFileUpload)">
        </n-button> -->
      </template>
    </Header>

    <div>
      <div class="text-center mt-20px">
        <n-image :src="imgUri" width="200" preview-disabled />
      </div>
    </div>

    <Tabbar />
  </n-scrollbar>
</template>

<style lang="less" scoped></style>
