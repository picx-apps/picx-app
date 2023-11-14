const setting_filename = ".settings.json";
import { useGlobalState } from ".";
import { MessageKeys } from "../language";

export interface RepoSetting {
  lastModifyTime: number;
  language: MessageKeys;
  theme: string;
  recycleBin: {
    [path: string]: boolean;
  };
}

const defaultsSettings: RepoSetting = {
  recycleBin: {},
  theme: "auto",
  language: "en-US",
  lastModifyTime: Date.now(),
};

const { octokit, user, repo_name, branch_name } = useGlobalState();

export const useSettingState = createGlobalState(() => {
  const settings = useStorage<RepoSetting>("picx-settings", {
    ...defaultsSettings,
  });
  const settingsSerializer = computed(() =>
    btoa(JSON.stringify(settings.value))
  );

  //同步远程配置
  function syncRemoteSettings(content: string) {
    settings.value = JSON.parse(atob(content)) satisfies RepoSetting;
  }
  //获取远程
  async function getRemoteSettings() {
    return octokit.value.request("GET /repos/{owner}/{repo}/contents/{path}", {
      owner: user.value?.login!,
      repo: repo_name.value,
      ref: branch_name.value,
      path: setting_filename,
      t: Date.now(),
    });
  }
  //检查是否存在
  async function checkExistsOfSettings() {
    try {
      return await getRemoteSettings();
    } catch (error) {
      return;
    }
  }
  //创建文件
  async function createSettingsFile() {
    return await octokit.value.request(
      "PUT /repos/{owner}/{repo}/contents/{path}",
      {
        owner: user.value?.login!,
        repo: repo_name.value,
        ref: branch_name.value,
        path: setting_filename,
        message: `chore: Create ${setting_filename}`,
        content: settingsSerializer.value,
      }
    );
  }
  //更新文件
  async function updateSettingsFile() {
    const res = await getRemoteSettings().catch(() => ({
      data: { sha: undefined as string | undefined },
    }));

    await octokit.value.request("PUT /repos/{owner}/{repo}/contents/{path}", {
      owner: user.value?.login!,
      repo: repo_name.value,
      ref: branch_name.value,
      sha: (res.data as any).sha,
      path: setting_filename,
      message: `chore: Create ${setting_filename}`,
      content: settingsSerializer.value,
    });
    autoCreateOfSettings();
  }
  //检查远程是否存在该文件，如果存在直接与本地同步，如果不存在则创建
  async function autoCreateOfSettings() {
    const exist = await checkExistsOfSettings();
    if (exist && "content" in exist.data) {
      return syncRemoteSettings(exist.data.content);
    }
    createSettingsFile();
  }

  return {
    settings,
    settingsSerializer,
    getRemoteSettings,
    syncRemoteSettings,
    autoCreateOfSettings,
    checkExistsOfSettings,
    createSettingsFile,
    updateSettingsFile,
  };
});
