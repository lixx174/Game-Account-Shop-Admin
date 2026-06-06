# 鑫轩游戏 - 游戏账号管理后台

## 项目概述

一个面向管理员的游戏账号管理后台系统，提供游戏信息管理、游戏账号（商品）管理、游戏字典数据维护等功能。

## 技术栈

| 技术 | 版本 | 用途 |
|------|------|------|
| Vue | 3.5.x | 前端框架 |
| Vite | 6.x | 构建工具 |
| Ant Design Vue | 4.2.x | PC 端 UI 组件库 |
| Vue Router | 4.x | 路由管理 |
| Pinia | 2.x | 状态管理 |
| Axios | 1.x | HTTP 请求库 |

## 快速开始

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev

# 构建生产环境
pnpm build

# 预览生产构建
pnpm preview
```

开发服务器默认运行在 `http://localhost:5173`

## 环境变量配置

项目通过环境变量 `VITE_APP_BASE` 控制构建时的 `base` 路径：

| 场景 | `VITE_APP_BASE` 值 | 用途 |
|------|-------------------|------|
| 本地开发（默认） | `/` | 本地开发服务器 |
| 生产构建 | 按需注入 | 通用生产环境 |
| GitHub Pages | `/Game-Account-Shop-App/` | GitHub Pages 子目录部署 |

配置位于 `vite.config.js`，通过 `loadEnv` 读取环境变量：

```js
base: env.VITE_APP_BASE || '/'
```

## 运行时配置

请求前缀通过 `public/config.js` 动态配置，支持部署后无重新构建修改接口地址：

```js
// public/config.js
window.URL_CONFIG = {
    BASE_URL: '/admin',
}
```

`src/api/request.js` 中通过 `window.URL_CONFIG?.BASE_URL` 读取该配置作为 Axios 的 `baseURL`。

## 项目目录结构

```
game-account-shop-admin/
├── public/                     # 静态资源
│   ├── config.js               # 运行时配置（请求前缀等）
│   └── vite.svg                # 站点图标
├── src/
│   ├── api/                    # 接口层
│   │   ├── request.js          # Axios 封装（含拦截器）
│   │   ├── game.js             # 游戏管理接口
│   │   ├── gameAccount.js      # 游戏账号管理接口
│   │   └── gameDictionary.js   # 游戏字典管理接口
│   ├── assets/                 # 静态资源（图片、字体等）
│   ├── components/             # 公共组件
│   │   ├── AppFormModal.vue    # 通用表单弹窗
│   │   └── AppTable.vue        # 通用表格
│   ├── router/                 # 路由配置
│   │   └── index.js            # Hash 路由配置
│   ├── stores/                 # Pinia 状态管理
│   │   ├── game.js             # 游戏状态
│   │   ├── gameAccount.js      # 游戏账号状态
│   │   └── gameDictionary.js   # 游戏字典状态
│   ├── views/                  # 页面视图
│   │   ├── layout/
│   │   │   └── MainLayout.vue  # 主布局（侧边栏 + 内容区）
│   │   ├── game/
│   │   │   └── index.vue       # 游戏管理页
│   │   ├── game-account/
│   │   │   └── index.vue       # 游戏账号管理页
│   │   └── game-dictionary/
│   │       └── index.vue       # 游戏字典管理页
│   ├── App.vue                 # 根组件
│   ├── main.js                 # 入口文件
│   └── style.css               # 全局样式
├── index.html
├── package.json
├── vite.config.js              # Vite 构建配置
└── README.md
```

## 核心约定

1. **路由模式**：采用 `createWebHashHistory` Hash 路由，兼容静态部署环境
2. **侧边栏菜单**：通过 `router/index.js` 的 `meta` 字段配置菜单标题和图标
3. **请求封装**：统一在 `request.js` 中处理响应状态码，非 200 时自动弹出错误提示
4. **组件复用**：`AppFormModal` 和 `AppTable` 为公共组件，各模块通过传参复用
