import { components, operations } from "@octokit/openapi-types";

export type RepoContents = components["schemas"]["content-directory"];

export type RepoInfo = components["schemas"]["repo-search-result-item"];

export type BranchInfo = components["schemas"]["short-branch"];

export type CreateRepoContents =
  operations["repos/create-for-authenticated-user"]["requestBody"]["content"]["application/json"];
