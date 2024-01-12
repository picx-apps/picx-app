# PicX-APP

[![Author](https://img.shields.io/badge/author-XPoet-violet.svg)](https://github.com/picx-apps)
[![Release](https://img.shields.io/github/release/XPoet/picx.svg)](https://github.com/picx-apps/picx-app/releases)
[![License](https://img.shields.io/github/license/XPoet/picx.svg)](https://github.com/picx-apps/picx-app/LICENSE)
[![Stars](https://img.shields.io/github/stars/XPoet/picx)](https://github.com/picx-apps/picx-app)
[![Issues](https://img.shields.io/github/issues/XPoet/picx)](https://github.com/picx-apps/picx-app/issues)
[![Deploy](https://github.com/XPoet/picx/workflows/deploy/badge.svg)](https://github.com/picx-apps/picx-app/actions/workflows/main.yml)
**[PicX](https://picx.xpoet.cn)** 是一款基于 GitHub API 开发的图床工具，提供图片上传托管、生成图片链接和常用图片工具箱服务。

## 全平台

- macos
- macos_m1
- linux
- windows
- web https://picx.xpoet.cn/

## 基本功能演示

<div align="left">
  <video controls height="500"><source src="./docs/use.mp4" type="video/mp4" /></video>
</div>

### 📱 安装：到 release 下载你系统对应版本的包文件

如果你是 macos m1 系列，可以使用 PicX_version_aarch64.dmg 或者 PicX_version_x64.dmg 版本的安装包，安装时请务必打开 
<br />
❗️<em>设置 => 隐私与安全 => 安全性 => 打开允许任何来源</em>  
🖱️开源软件买不起证书 ^_^

<div align="left">
  <video controls height="500"><source src="./docs/m1_install.mp4" type="video/mp4" /></video>
</div>

### Tauri + Vue3

- [Tauri](https://tauri.app/zh-cn/) 构建跨平台的快速、安全、前端隔离应用
- [Vue3](https://cn.vuejs.org/) 渐进式 JavaScript 框架


### Icons

- [Iconify](https://iconify.design) - use icons from any icon sets [🔍Icônes](https://icones.netlify.app/)
- [Pure CSS Icons via UnoCSS](https://github.com/antfu/unocss/tree/main/packages/preset-icons)

### Plugins

- [Vue Router](https://github.com/vuejs/vue-router)
  - [`unplugin-vue-router`](https://github.com/posva/unplugin-vue-router) - file system based routing
- [`unplugin-auto-import`](https://github.com/antfu/unplugin-auto-import) - Directly use Vue Composition API and others without importing
- [`unplugin-vue-components`](https://github.com/antfu/unplugin-vue-components) - components auto import
- [VueUse](https://github.com/antfu/vueuse) - collection of useful composition APIs

## 开发规范

#### 下载源码
```shell
git clone git@github.com:picx-dev/picx-app.git
```

#### 安装rust. 查看官方文档 [rust 官方文档](https://www.rust-lang.org/tools/install)

#### 安装相关依赖

```shell
pnpm install
```

#### 启动项目Dev
with [cargo](https://doc.rust-lang.org/cargo/)
```shell
cargo tauri dev
```

with node >= v20.10.0
```
pnpm tauri dev
```

#### 设置环境变量
在根目录下 添加 .env ,并添加以下内容

```ts
VITE_GITHUB_INSTALL_URL="github app install uri"
VITE_GITHUB_STATE="random string"
VITE_GITHUB_SCOPE="github auth scope"
VITE_GITHUB_CLIENT_ID="github client id"
VITE_GITHUB_CLIENT_SECRET="github client secret"
VITE_GITHUB_REDIRECT_URI="github app callback uri"
VITE_GITHUB_PRIVATE_KEY="your github app private key"
```

#### git commit 规范遵循 [@commitlint/config-conventional](https://github.com/conventional-changelog/commitlint/tree/master/@commitlint/config-conventional)

#### 代码风格遵循 prettier + eslint
