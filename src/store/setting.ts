import { useGlobalState } from ".";
import { CDNDefaultOptions } from "../constant";
import { MessageKeys } from "../language";
import { mergeWith } from "lodash-es";

const setting_filename = ".settings.json";

export type CDNKey = "GitHub" | "JsDelivr" | "ChinaJsDelivr" | "Statically" | string | "";

export interface CDN {
  key: CDNKey;
  value: string;
  isDefault?: boolean;
}

export interface RepoSetting {
  lastModifyTime: number;
  language: MessageKeys;
  theme: string;
  cdn: CDN[];
  currentCDNKey: CDNKey;
  recycleBin: {
    [path: string]: boolean;
  };
}

const defaultsSettings: RepoSetting = {
  recycleBin: {},
  theme: "auto",
  language: "en-US",
  currentCDNKey: "JsDelivr",
  cdn: CDNDefaultOptions,
  lastModifyTime: Date.now(),
};

const { octokit, user, repo_name, branch_name } = useGlobalState();

export const useSettingState = createGlobalState(() => {
  const settings = useStorage<RepoSetting>(
    "picx-settings",
    {
      ...defaultsSettings,
    },
    undefined,
    { mergeDefaults: true },
  );
  const settingsSerializer = computed(() => btoa(JSON.stringify(settings.value)));
  const currentCDN = computed(() => settings.value.cdn.find((item) => item.key === settings.value.currentCDNKey));

  //同步远程配置
  function syncRemoteSettings(content: string) {
    const result = JSON.parse(atob(content)) satisfies RepoSetting;
    settings.value = mergeWith(settings.value, result);
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
    return await octokit.value.request("PUT /repos/{owner}/{repo}/contents/{path}", {
      owner: user.value?.login!,
      repo: repo_name.value,
      ref: branch_name.value,
      path: setting_filename,
      message: `chore: Create ${setting_filename}`,
      content: settingsSerializer.value,
    });
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
      sha: (res?.data as any).sha,
      path: setting_filename,
      message: `chore: Create ${setting_filename}`,
      content: settingsSerializer.value,
    });
  }
  //检查远程是否存在该文件，如果存在直接与本地同步，如果不存在则创建
  async function autoCreateOfSettings() {
    if (!repo_name.value || !branch_name.value) return;
    const exist = await checkExistsOfSettings();
    if (exist && "content" in exist.data) {
      return syncRemoteSettings(exist.data.content);
    }
    createSettingsFile();
  }
  //新添加的规则都属于自定义
  function addCDN(key: CDNKey, value: string) {
    settings.value.cdn.push({ key, value, isDefault: false });
    updateSettingsFile();
  }
  //不能删除默认规则
  function removeCDN(key: string) {
    const index = settings.value.cdn.findIndex((item) => item.key === key);
    const result = settings.value.cdn[index];
    if (index !== -1 && result.isDefault !== true) {
      settings.value.cdn.splice(index, 1);
      updateSettingsFile();
    }
  }

  return {
    settings,
    currentCDN,
    settingsSerializer,
    getRemoteSettings,
    syncRemoteSettings,
    autoCreateOfSettings,
    checkExistsOfSettings,
    createSettingsFile,
    updateSettingsFile,
    addCDN,
    removeCDN,
  };
});
