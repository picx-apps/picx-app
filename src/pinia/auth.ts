// stores/counter.js
import { defineStore } from "pinia";
import { UserToken } from "~/types/auth";

interface State {
  auth: UserToken | null;
}

export const userStore = defineStore("auth", {
  state: (): State => {
    return {
      auth: null,
    };
  },
  getters: {
    getAuth: (state) => {
      if (!state.auth) {
        state.auth = JSON.parse(localStorage.getItem("auth") || "null");
      }
      return state.auth;
    },
  },
  actions: {
    setAuth(value: UserToken) {
      this.auth = value;
      localStorage.setItem("auth", JSON.stringify(value));
    },
  },
});
