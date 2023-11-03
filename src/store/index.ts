import { merge } from "lodash-es";

export interface UserToken {
  access_token: string;
  scope: string;
  token_type: string;
}

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
  const repository = useStorage<Repository>(
    "picx-repository",
    {
      repo_name: "",
      branch_name: "",
    },
    localStorage
  );

  // getters
  const access_token = computed(() => authorize.value.access_token);
  const scope = computed(() => authorize.value.scope);
  const token_type = computed(() => authorize.value.token_type);
  const repo_name = computed(() => repository.value.repo_name);
  const branch_name = computed(() => repository.value.branch_name);

  // actions
  function set_authorize(value: UserToken) {
    authorize.value = value;
  }
  function set_repository(value: Partial<Repository>) {
    repository.value = merge(repository.value, value);
  }

  return {
    access_token,
    scope,
    token_type,
    repo_name,
    branch_name,
    set_authorize,
    set_repository,
  };
});
