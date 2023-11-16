<script lang="ts" setup>
import { Icon } from "@iconify/vue";
const route = useRoute();
const code = route.query.code as string;
const setup_action = route.query.setup_action as string;

onMounted(() => {
  if (!code) return;
  if (setup_action && setup_action === "install") {
    location.href = "picx://installations" + location.search;
    return;
  }
  location.href = "picx://authorization" + location.search;
});
</script>

<template>
  <div class="text-center pt-30px">
    <Icon icon="fluent-emoji:carrot" class="text-5rem color-gray-6" />
    <template v-if="code">
      <div class="text-1.5rem color-gray-6">
        GitHub authorization authentication successful
      </div>
      <div class="text-1rem color-gray-4">about to open the app</div>
    </template>
    <template v-else>
      <div class="text-1.5rem color-gray-6">
        GitHub authorization authentication
      </div>
    </template>
  </div>
</template>
