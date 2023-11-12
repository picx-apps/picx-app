/// <reference types="unplugin-icons/types/svelte" />

import "@iconify/vue";
import { HTMLAttributes } from "vue";

declare module "@iconify/vue" {
  declare interface IconifyIconProps extends HTMLAttributes {}
}

export {};
