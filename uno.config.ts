import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetUno,
  presetWebFonts,
} from "unocss";

export default defineConfig({
  presets: [
    presetAttributify(),
    presetIcons({}),
    presetUno(),
    presetWebFonts({}),
  ],
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
