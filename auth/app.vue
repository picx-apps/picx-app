<script lang="ts" setup>
const route = useRoute();
const code = route.query.code as string;
onMounted(() => {
  location.href = "picx://?code=" + code;
});
</script>

<template>
  <div>
    <NuxtWelcome />
  </div>
</template>
