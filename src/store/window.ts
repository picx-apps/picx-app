import { useGlobalState } from ".";
import { WebviewWindow } from "@tauri-apps/api/window";

enum WindowLabel {
  MAIN = "main",
  AUTH = "auth",
}

export const useWindowState = createGlobalState(() => {
  const mainWindow = ref(WebviewWindow.getByLabel(WindowLabel.MAIN));
  const authWindow = ref(WebviewWindow.getByLabel(WindowLabel.AUTH));
  const { login_uri } = useGlobalState();

  function createAuthWindow() {
    authWindow.value = new WebviewWindow("auth", {
      url: login_uri,
      title: "Authorize",
      theme: "dark",
      width: 1235,
      height: 930,
      minWidth: 875,
      minHeight: 600,
    });
    authWindow.value.onCloseRequested(() => {});
  }
  function closeAuthWindow() {
    authWindow.value?.emit("auth://close");
    authWindow.value?.close();
    mainWindow.value?.show();
  }

  return {
    mainWindow,
    authWindow,
    createAuthWindow,
    closeAuthWindow,
  };
});
