/// <reference types="vite/client" />

declare module "*.vue" {
  import type { DefineComponent } from "vue";
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

interface ImportMetaEnv {
  readonly VITE_CLIENT_ID: string;
  readonly VITE_CLIENT_SECRET: string;
  readonly VITE_REDIRECT_URI: string;
  readonly VITE_STATE: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
