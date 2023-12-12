import { CompressionQuality } from "../enum";
import type { User, UserToken } from "../types";
import { invoke } from "@tauri-apps/api";
import router from "~/router";
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

  // getters
  const access_token = computed(() => authorize.value.access_token);
  const scope = computed(() => authorize.value.scope);
  const token_type = computed(() => authorize.value.token_type);
  const repo_name = computed(() => repository.value.repo_name);
  const branch_name = computed(() => repository.value.branch_name);
  const user = computed(() => userinfo.value);

  watch(
    [authorize, userinfo, repository],
    async ([auth, userinfo, repository]) => {
      if (auth.access_token) {
        octokit.value = new Octokit({
          auth: auth.access_token,
        });
      }
      if (auth.access_token && !userinfo) {
        const res = await octokit.value!.request("GET /user");
        if (res.status === 200) {
          set_userinfo(res.data);
        }
      }
      if (auth.access_token && userinfo && (!repository.repo_name || !repository.branch_name)) {
        router.replace({ name: "lead" });
      }
    },
    { immediate: true },
  );

  // actions
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
  function logout() {
    localStorage.clear();
    router.push("/login");
  }
  async function checkUserInstallApps(username: string) {
    const token = await invoke("sign_jwt", { privateKey: import.meta.env.VITE_PRIVATE_KEY }).catch((err) => {
      logout();
      throw new Error(err);
    });

    const octokit = new Octokit({
      auth: token,
    });
    const installations = await octokit.request("GET /app/installations", {
      headers: {
        "X-GitHub-Api-Version": "2022-11-28",
      },
    });
    if (installations.status === 200) {
      return installations.data.some((item) => item.account?.login === username);
    }
    return false;
  }

  return {
    access_token,
    scope,
    token_type,
    user,
    repo_name,
    branch_name,
    octokit,
    repository,
    compress,
    set_authorize,
    get_userinfo,
    set_userinfo,
    set_repository,
    checkUserInstallApps,
  };
});
