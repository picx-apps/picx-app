<script lang="ts" setup>
const route = useRoute();
const setup_action = route.query.setup_action as string;

onMounted(() => {
  if (setup_action && setup_action === "install") {
    location.href = "picx://installations" + location.search;
    return;
  }
  location.href = "picx://authorization" + location.search;
});
</script>

<template>
  <div>
    <NuxtWelcome />
  </div>
</template>
