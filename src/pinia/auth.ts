// stores/counter.js
import { defineStore } from "pinia";
import { UserToken } from "../types/auth";

const AUTH_KEY = "auth";
const GITHUB_LOCAL_KEY = "github_token";

interface State {
  auth: UserToken | null;
  github_token: string | null;
}

export const userStore = defineStore("auth", {
  state: (): State => {
    return {
      auth: null,
      github_token: null,
    };
  },
  getters: {
    getAuth: (state) => {
      if (!state.auth) {
        state.auth = JSON.parse(localStorage.getItem(AUTH_KEY) || "null");
      }
      return state.auth;
    },
    parseGithubToken: (state) => {
      if (!state.github_token) {
        state.github_token = localStorage.getItem(GITHUB_LOCAL_KEY) || null;
      }
      state.github_token ? window.atob(state.github_token) : null;
      return state.github_token;
    },
  },
  actions: {
    setAuth(value: UserToken) {
      this.auth = value;
      localStorage.setItem(AUTH_KEY, JSON.stringify(value));
    },
    setGithubToken(value: string) {
      if (value) {
        this.github_token = window.btoa(value);
        localStorage.setItem(GITHUB_LOCAL_KEY, this.github_token);
      }
    },
  },
});
