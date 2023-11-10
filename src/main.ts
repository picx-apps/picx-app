import "./styles.css";
import "uno.css";

import { createApp } from "vue";
import App from "./App.vue";
import { createPinia } from "pinia";
import router from "./router";
import { createI18n } from "vue-i18n";
import {
  default as messages,
  MessageSchema,
  MessageKeys,
  language,
} from "./language";

const pinia = createPinia();
const i18n = createI18n<[MessageSchema], MessageKeys>({
  legacy: false,
  locale: language.value,
  fallbackLocale: navigator.language,
  messages,
});

createApp(App).use(pinia).use(i18n).use(router).mount("#app");
