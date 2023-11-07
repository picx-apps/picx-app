<script lang="ts" setup>
import { Icon } from "@iconify/vue";

const props = defineProps<{
  dir?: string;
  path: string;
  content: string;
  size: number;
}>();

const src = computed(() => "data:image/png;base64," + props.content);
const size = computed(() => Math.floor(props.size / 1024));
</script>

<template>
  <div class="image-card__container">
    <n-image
      :src="src"
      width="80"
      height="80"
      object-fit="cover"
      class="rounded-lg"
    />
    <div class="h-80px ml-20px flex-1 flex flex-col justify-around">
      <div
        class="lh-24px text-1.1rem color-#707070 font-bold truncate max-w-200px"
      >
        {{ path }}
      </div>
      <div
        class="text-12px color-#707070 font-bold truncate max-w-200px mb-3px flex items-center"
      >
        <Icon icon="octicon:file-directory-fill-24" class="mr-4px text-16px" />
        <span class="color-#8c8c8c">{{ dir ? dir : "/" }}</span>
      </div>
      <div>
        <div class="flex items-center">
          <span
            class="color-#487aef text-10px bg-#dddeff px-4px py-2px rounded-4px"
          >
            {{ size }} kb
          </span>
          <Icon
            icon="material-symbols:arrow-right-alt"
            class="mx-4px"
            :rotate="90"
          />
          <span
            class="color-#5c5c5c text-10px bg-#f4f4f4 px-4px py-2px rounded-4px"
          >
            {{ size }} kb
          </span>
        </div>
      </div>
    </div>

    <div>
      <Icon
        icon="material-symbols:delete"
        class="text-1.5rem color-#8c8c8c hover:color-#487aef cursor-pointer"
      />
    </div>
  </div>
</template>

<style lang="less" scoped>
.image-card__container {
  display: flex;
  flex-direction: row;
  align-items: center;
  & + & {
    margin-top: 20px;
  }
}
.a {
  color: #f4f4f4;
}
</style>
