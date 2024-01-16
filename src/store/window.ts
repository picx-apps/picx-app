import { WebviewWindow } from "@tauri-apps/api/window";

enum WindowLabel {
  MAIN = "main",
  AUTH = "auth",
}

export const useWindowState = createGlobalState(() => {
  const mainWindow = ref(WebviewWindow.getByLabel(WindowLabel.MAIN));
  const authWindow = ref(WebviewWindow.getByLabel(WindowLabel.AUTH));

  function createAuthWindow() {
    authWindow.value = new WebviewWindow(WindowLabel.AUTH, {
      url: import.meta.env.VITE_APP_REDIRECT_URI,
      title: "Github Authorize",
      theme: "dark",
      width: 1235,
      height: 930,
      minWidth: 875,
      minHeight: 600,
    });
  }

  return {
    mainWindow,
    authWindow,
    createAuthWindow,
  };
});
