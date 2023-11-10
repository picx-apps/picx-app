import { MessageSchema } from "../language";
import { useI18n as i18n } from "vue-i18n";

export default function useI18n<T = MessageSchema>() {
  return i18n<{ message: T }>();
}
