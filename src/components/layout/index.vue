<script lang="ts" setup></script>

<template>
  <div class="layout flex flex-col h-screen p-10px">
    <LayoutHeader />
    <div class="flex h[calc(100%-30px)]">
      <LayoutAside class="aside w-300px" />
      <div class="container flex-1 bg-#131313 rounded-8px ml-10px">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped></style>
