import enUS from "./en-us.json";
import zhCN from "./zh-cn.json";

const messages = {
  "en-US": enUS,
  "zh-CN": zhCN,
};

const language = useStorage<MessageKeys>("language", "zh-CN");

export const messageOptions = [
  {
    label: "English",
    value: "en-US",
  },
  {
    label: "简体中文",
    value: "zh-CN",
  },
];

export type MessageSchema = typeof enUS;

export type MessageKeys = keyof typeof messages;

export { language };

export default messages;
