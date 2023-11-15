import { components } from "@octokit/openapi-types";

export type User = components["schemas"]["public-user"];

export interface UserConfig {
  token: UserToken;
  user: User;
}

export interface UserToken {
  access_token: string;
  scope: string;
  token_type: string;
}

export interface SchemePayload {
  base: string;
  query: string;
}
