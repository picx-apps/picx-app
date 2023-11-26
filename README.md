# PicX-APP

[![License](https://img.shields.io/github/license/XPoet/picx.svg)](https://github.com/XPoet/picx/blob/master/LICENSE)


官方网站 https://picx.xpoet.cn/

**基于 GitHub API 开发的图床神器。** 图片外链使用 jsDelivr 自动进行 CDN 加速。

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

#### 开始启动dev前请务必先执行构建，原因是因为授权是在第三方，授权完成需要使用Schemes打开应用，所以需要你现在本机安装此App,具体流程如下

```shell
//第一步,注意这里必须使用debug模式
cargo tauri build --debug

//第二步
安装构建好的软件

//第三步
cargo tauri dev
```

#### 启动项目Dev
with [cargo](https://doc.rust-lang.org/cargo/)
```shell
cargo tauri dev
```

with node >= v18.17.0
```
pnpm tauri dev
```

#### 设置环境变量
在根目录下 添加 .env ,并添加以下内容

```ts
VITE_STATE="picx-app" //随机字符
VITE_SCOPE="user repo project" //授权范围
VITE_CLIENT_ID="your github app client id"
VITE_REDIRECT_URI="https://picx.qzzhu.cn/authorization" //授权回调地址
VITE_CLIENT_SECRET="your github app client secret"
VITE_INSTALL_URL="your github app install uri" // 例如 https://github.com/apps/picx-app
```

#### 添加 github [private-key.pem](https://docs.github.com/zh/apps/creating-github-apps/authenticating-with-a-github-app/about-authentication-with-a-github-app#generating-a-private-key) 然后把生成出来的文件放在 src-tauri/src/assets/private-key.pem

#### git commit 规范遵循 [@commitlint/config-conventional](https://github.com/conventional-changelog/commitlint/tree/master/@commitlint/config-conventional)

#### 代码风格遵循 prettier + eslint
