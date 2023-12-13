import { CompressionQuality } from "../enum";
import type { User, UserToken } from "../types";
import { invoke } from "@tauri-apps/api";
import { merge } from "lodash-es";
import { Octokit } from "octokit";

export interface Repository {
  repo_name: string;
  branch_name: string;
}

export interface Compress {
  enable: boolean;
  compress_type: keyof typeof CompressionQuality;
}

export const useGlobalState = createGlobalState(() => {
  // state
  const authorize = useStorage<UserToken>(
    "picx-authorize",
    {
      access_token: "",
      scope: "",
      token_type: "",
    },
    localStorage,
  );
  const userinfo = useStorage<User | null>("picx-userinfo", null, undefined, {
    serializer: {
      read: (v) => {
        return v ? JSON.parse(v) : null;
      },
      write: (v) => JSON.stringify(v),
    },
  });
  const repository = useStorage<Repository>(
    "picx-repository",
    {
      repo_name: "",
      branch_name: "",
    },
    localStorage,
  );
  const octokit = ref(new Octokit({}));
  const compress = useStorage<Compress>(
    "picx-compress",
    {
      enable: true,
      compress_type: CompressionQuality.Default,
    },
    localStorage,
  );
  const isInstalled = ref<boolean>(false);

  // getters
  const access_token = computed(() => authorize.value.access_token);
  const scope = computed(() => authorize.value.scope);
  const token_type = computed(() => authorize.value.token_type);
  const repo_name = computed(() => repository.value.repo_name);
  const branch_name = computed(() => repository.value.branch_name);
  const user = computed(() => userinfo.value);

  // actions
  async function initState() {
    if (authorize.value.access_token) {
      octokit.value = new Octokit({
        auth: authorize.value.access_token,
      });
    }
    if (authorize.value.access_token && !userinfo.value) {
      await get_userinfo();
    }
  }
  function init_octokit() {
    if (authorize.value.access_token) {
      octokit.value = new Octokit({
        auth: authorize.value.access_token,
      });
    }
  }
  function set_authorize(value: UserToken) {
    authorize.value = value;
    init_octokit();
  }
  async function get_userinfo() {
    const res = await octokit.value!.request("GET /user");
    if (res.status === 200) {
      await initUserInstallApp(res.data.login);
      set_userinfo(res.data);
    }
    return res.data;
  }
  function set_userinfo(value: User) {
    userinfo.value = value;
  }
  function set_repository(value: Partial<Repository>) {
    repository.value = merge(repository.value, value);
  }
  async function initUserInstallApp(username: string) {
    if (isInstalled.value === true) return isInstalled.value;
    const token = await invoke("sign_jwt", { privateKey: import.meta.env.VITE_PRIVATE_KEY }).catch((err) => {
      throw new Error(err);
    });

    const octokit = new Octokit({
      auth: token,
    });
    const installations = await octokit.request("GET /app/installations", {
      t: Date.now(),
    });
    if (installations.status === 200) {
      isInstalled.value = installations.data.some((item) => item.account?.login === username);
      return isInstalled.value;
    }
    return false;
  }
  function onInstallation() {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve, reject) => {
      if (!user.value || !user.value.login) {
        return reject("user not login");
      }
      if (isInstalled.value === false) {
        await initUserInstallApp(user.value.login);
      }
      if (isInstalled.value) {
        resolve(isInstalled.value);
      } else {
        reject("user not install");
      }
    });
  }

  return {
    authorize,
    userinfo,
    access_token,
    scope,
    token_type,
    user,
    repo_name,
    branch_name,
    octokit,
    repository,
    compress,
    isInstalled,
    set_authorize,
    get_userinfo,
    set_userinfo,
    set_repository,
    initUserInstallApp,
    onInstallation,
    initState,
  };
});
