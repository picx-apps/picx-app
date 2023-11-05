import { writeBinaryFile, type BinaryFileContents } from "@tauri-apps/api/fs";
import { save } from "@tauri-apps/api/dialog";
import { downloadDir } from "@tauri-apps/api/path";

export async function useWriteBinaryFile(
  content: BinaryFileContents,
  uri?: string,
  title?: string
) {
  const downloadDirPath = (await downloadDir()) + uri;
  const path = await save({
    title,
    defaultPath: downloadDirPath,
    filters: [
      { name: "Image", extensions: ["jpg", "jpeg", "png", "gif", "bmp"] },
    ],
  });
  if (!path) return false;
  try {
    await writeBinaryFile(path, content);
    return true;
  } catch {
    return false;
  }
}
