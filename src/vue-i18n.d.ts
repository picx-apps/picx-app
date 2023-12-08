import type { MessageSchema } from "~/language/index";
import { DefineDateTimeFormat, DefineLocaleMessage, DefineNumberFormat } from "vue-i18n";

declare module "vue-i18n" {
  // define the locale messages schema
  export interface DefineLocaleMessage extends MessageSchema {}

  // define the datetime format schema
  export interface DefineDateTimeFormat {
    short: {
      hour: "numeric";
      minute: "numeric";
      second: "numeric";
      timeZoneName: "short";
      timezone: string;
    };
  }
}
