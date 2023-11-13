import { useSettings } from "../settings";

export const isDeletableInRecycleBin = (path: string) => {
  const { settingsStore } = useSettings();
  const folderDeletable = settingsStore.value.recycleBin[path];
  return folderDeletable === true;
};
