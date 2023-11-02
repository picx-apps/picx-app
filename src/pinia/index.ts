import { merge } from "lodash-es";
import { defineStore } from "pinia";
const PICX_CONFIG = "picx_config";

interface PicxConfig {
  repo: string;
  branch: string;
}

interface State {
  picxConfig: PicxConfig;
}

export const picxStore = defineStore("picx", {
  state: (): State => {
    return {
      picxConfig: {
        repo: "",
        branch: "",
      },
    };
  },
  getters: {
    getPicxConfig: (state) => {
      console.log("getter", state.picxConfig);
      if (state.picxConfig.repo === "" || state.picxConfig.branch === "") {
        const config = JSON.parse(localStorage.getItem(PICX_CONFIG) || "null");
        state.picxConfig.repo = config?.repo;
        state.picxConfig.branch = config?.branch;
      }
      return state.picxConfig;
    },
  },
  actions: {
    setPicxConfig(value: Partial<PicxConfig>) {
      this.picxConfig = merge(this.picxConfig, value);
      localStorage.setItem(PICX_CONFIG, JSON.stringify(this.picxConfig));
    },
  },
});
