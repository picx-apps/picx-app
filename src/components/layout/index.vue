<script lang="ts" setup></script>

<template>
  <div class="layout flex flex-col h[calc(100vh-30px)] p-10px">
    <div class="flex h-full">
      <div class="w-300px">
        <LayoutAside />
      </div>
      <div class="w[calc(100%-300px)] bg-#131313 rounded-8px ml-10px overflow-hidden">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped></style>
