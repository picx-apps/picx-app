import { MessageKeys } from "../language";
import { useGlobalState } from "../store";

export const settingsFileName = ".settings.json";

export interface RepoSetting {
  lastModifyTime: number;
  language: MessageKeys;
  theme: string;
  recycleBin: {
    [path: string]: boolean;
  };
}

export const defaultsSettings = {
  recycleBin: {},
  theme: "auto",
  language: "en-US",
  lastModifyTime: Date.now(),
} satisfies RepoSetting;

export const settingsSerializer = {
  write(value: RepoSetting) {
    return btoa(encodeURI(JSON.stringify(value)));
  },
  read(raw: string) {
    return JSON.parse(atob(decodeURI(raw)));
  },
};

export const defaultsSettingsOfJson = JSON.stringify(defaultsSettings);

export const defaultsSettingsOfBase64 =
  settingsSerializer.write(defaultsSettings);

export interface CreateSettingsOptions {
  repo?: string;
  ref?: string;
  settings?: RepoSetting;
}

const { octokit, user, repo_name, branch_name } = useGlobalState();

const defaultsOptionsGen = () => {
  return {
    repo: repo_name.value,
    ref: branch_name.value,
  };
};

export const createOrUpdateSettings = (options: CreateSettingsOptions) => {
  const { ref: _ref, repo: _repo } = defaultsOptionsGen();

  const { ref = _ref, repo = _repo, settings } = options;

  return octokit.value.rest.repos.createOrUpdateFileContents({
    owner: user.value?.login!,
    repo,
    ref,
    path: settingsFileName,
    message: `chore: Create ${settingsFileName}`,
    content: settingsSerializer.write(settings || defaultsSettings),
  });
};

export const getRemoteSettings = async (options?: CreateSettingsOptions) => {
  const { ref: _ref, repo: _repo } = defaultsOptionsGen();

  const { ref = _ref, repo = _repo } = options || {};

  return octokit.value.request("GET /repos/{owner}/{repo}/contents/{path}", {
    owner: user.value?.login!,
    repo,
    ref,
    path: settingsFileName,
  });
};

export const checkExistsOfSettings = async (options: CreateSettingsOptions) => {
  try {
    await getRemoteSettings(options);
    return true;
  } catch (error) {
    return;
  }
};

export const autoCreateOfSettings = async (options: CreateSettingsOptions) => {
  if (await checkExistsOfSettings(options)) {
    return;
  }
  return createOrUpdateSettings(options);
};

const _settingsStore = useStorage<RepoSetting>(
  ".settings.json",
  defaultsSettings,
  localStorage,
  {
    serializer: {
      write(value) {
        return JSON.stringify(value);
      },
      read(raw) {
        return JSON.parse(raw);
      },
    },
  }
);

export const settingsStore = computed(() => _settingsStore.value);

export const useSettings = () => {
  const getSettings = () => {
    return _settingsStore;
  };

  const syncToLocalOfSettings = async () => {
    const res = await getRemoteSettings();
    if ("content" in res.data) {
      _settingsStore.value = settingsSerializer.read(res.data.content);
    }
  };

  const updateToRemoteOfSettings = async () => {
    createOrUpdateSettings({
      settings: _settingsStore.value,
    });
  };

  const localFirst = ref(true);

  const fetchSetting = async () => {
    const local = _settingsStore.value;
    let remote = defaultsSettings;
    const res = await getRemoteSettings();

    if ("content" in res.data) {
      remote = settingsSerializer.read(res.data.content);
    }
    if (local.lastModifyTime > remote.lastModifyTime) {
      localFirst.value = true;
    } else {
      localFirst.value = false;
    }
  };

  const setSettings = (settings: RepoSetting) => {
    settings.lastModifyTime = Date.now();
    _settingsStore.value = settings;
  };

  const getClonedSettings = () => {
    return JSON.parse(JSON.stringify(_settingsStore.value)) as RepoSetting;
  };

  const setSettingsAndUpdateToRemote = (settings: RepoSetting) => {
    setSettings(settings);
    return updateToRemoteOfSettings();
  };

  return {
    settingsStore,
    localFirst,
    getSettings,
    setSettings,
    syncToLocalOfSettings,
    updateToRemoteOfSettings,
    fetchSetting,
    getClonedSettings,
    setSettingsAndUpdateToRemote,
  };
};
