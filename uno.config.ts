import { defineConfig, presetAttributify, presetIcons, presetUno, presetWebFonts } from "unocss";

export default defineConfig({
  presets: [presetAttributify(), presetIcons({}), presetUno(), presetWebFonts({})],
  theme: {
    colors: {
      primary: {
        DEFAULT: "#5e14ff",
        500: "#5e14ff",
        400: "#6e44f9",
        300: "#8e70f1",
        200: "#b29fef",
        100: "#e6e0fb",
      },
    },
  },
  rules: [
    ["me-color-black", { color: "#1b153b" }],
    [
      "base-text-color",
      {
        background: "linear-gradient(120deg, #b047ff 16%, #9499ff, #9499ff)",
        "background-clip": "text",
        "-webkit-background-clip": "text",
        "-webkit-text-fill-color": "transparent",
      },
    ],
  ],
});
