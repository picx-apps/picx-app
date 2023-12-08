import "./styles.css";
import "uno.css";
import App from "./App.vue";
import { language, MessageKeys, default as messages, MessageSchema } from "./language";
import router from "./router";
import { loadIcons } from "@iconify/vue";
import { createPinia } from "pinia";
import { createApp } from "vue";
import { createI18n } from "vue-i18n";

const pinia = createPinia();
const i18n = createI18n<[MessageSchema], MessageKeys>({
  legacy: false,
  locale: language.value,
  fallbackLocale: navigator.language,
  messages,
});

createApp(App).use(pinia).use(i18n).use(router).mount("#app");

loadIcons([
  "ph:house-fill",
  "fluent-emoji:bread",
  "fluent-emoji:globe-showing-europe-africa",
  "fluent-emoji:ghost",
  "fluent-emoji:flexed-biceps",
  "fluent-emoji:ab-button-blood-type",
]);
