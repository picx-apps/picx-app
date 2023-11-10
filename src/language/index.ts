import enUS from "./en-us.json";
import zhCN from "./zh-cn.json";

const messages = {
  "en-US": enUS,
  "zh-CN": zhCN,
};

const language = useStorage<MessageKeys>("language", "en-US");

export type MessageSchema = typeof enUS;

export type MessageKeys = keyof typeof messages;

export { language };

export default messages;
