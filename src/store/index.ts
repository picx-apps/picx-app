import { merge } from "lodash-es";
import type { UserToken, User } from "../types";
import { Octokit } from "octokit";

export interface Repository {
  repo_name: string;
  branch_name: string;
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
    localStorage
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
    localStorage
  );
  const imagePath = useStorage<string[]>("picx-image-path", [], localStorage);

  // getters
  const access_token = computed(() => authorize.value.access_token);
  const scope = computed(() => authorize.value.scope);
  const token_type = computed(() => authorize.value.token_type);
  const repo_name = computed(() => repository.value.repo_name);
  const branch_name = computed(() => repository.value.branch_name);
  const user = computed(() => userinfo.value);
  const imagePaths = computed(() => imagePath.value);

  watch([authorize, userinfo], async ([authorize, userinfo]) => {
    if (authorize.access_token && !userinfo) {
      const octokit = new Octokit({
        auth: authorize.access_token,
      });
      const res = await octokit.request("GET /user");
      if (res.status === 200) {
        set_userinfo(res.data);
      }
    }
  });

  // actions
  function set_authorize(value: UserToken) {
    authorize.value = value;
  }
  function set_userinfo(value: User) {
    userinfo.value = value;
  }
  function set_repository(value: Partial<Repository>) {
    repository.value = merge(repository.value, value);
  }
  function addImagePath(value: string) {
    imagePath.value.push(value);
  }
  function removeImagePath(value: string) {
    const index = imagePath.value.indexOf(value);
    if (index !== -1) {
      imagePath.value.splice(index, 1);
    }
  }

  return {
    access_token,
    scope,
    token_type,
    user,
    repo_name,
    branch_name,
    imagePaths,
    set_authorize,
    set_userinfo,
    set_repository,
    addImagePath,
    removeImagePath,
  };
});
