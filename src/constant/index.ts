import { CDN } from "../store/setting";
import { DropdownOption } from "naive-ui";

export const HomeImageDropDownOptions: DropdownOption[] = [
  {
    label: "复制链接",
    key: "copy",
  },
  {
    label: "下载图片",
    key: "download",
  },
  {
    label: "删除",
    key: "delete",
  },
];

export const FolderDropDownOptions: DropdownOption[] = [
  {
    label: "删除",
    key: "delete",
  },
];

export const CDNDefaultOptions: CDN[] = [
  {
    key: "GitHub",
    value: "https://github.com/{{owner}}/{{repo}}/raw/{{branch}}/{{path}}",
    isDefault: true,
  },
  {
    key: "JsDelivr",
    value: "https://cdn.jsdelivr.net/gh/{{owner}}/{{repo}}@{{branch}}/{{path}}",
    isDefault: true,
  },
  {
    key: "ChinaJsDelivr",
    value: "https://jsd.cdn.zzko.cn/gh/{{owner}}/{{repo}}@{{branch}}/{{path}}",
    isDefault: true,
  },
  {
    key: "Statically",
    value: "https://cdn.statically.io/gh/{{owner}}/{{repo}}@{{branch}}/{{path}}",
    isDefault: true,
  },
];
