# admin_test1

[![CI](https://github.com/Angelo0218/admin_test1/actions/workflows/ci.yml/badge.svg)](https://github.com/Angelo0218/admin_test1/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Vue 3](https://img.shields.io/badge/Vue-3.5-42b883)](https://vuejs.org/)
[![Vite](https://img.shields.io/badge/Vite-8-646cff)](https://vitejs.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-6-3178c6)](https://www.typescriptlang.org/)
[![Element Plus](https://img.shields.io/badge/Element%20Plus-2.14-409eff)](https://element-plus.org/)

一個基於 Vue 3 + Element Plus 的現代後台管理介面範本：角色化選單、icon 語言切換、深色模式、Alova mock 開箱可用，無需後端即可開發。

A modern Vue 3 + Element Plus admin template with role-based menus, i18n via icon switcher, dark mode, and front-end Alova mocks — develop without a backend.

## 特色

- **🎨 Element Plus 2.14** — UI 庫，按需匯入 + SCSS 主題
- **🔐 角色化路由** — `meta.roles` 驅動的選單過濾與導覽守衛（admin / user 兩級權限）
- **🌐 i18n + Icon 切換** — `vue-i18n` 配 `circle-flags` 國旗 icon，繁中 / 英文即時切換
- **🌓 深色模式** — Element Plus 內建 dark CSS variables，pre-mount script 防 FOUC
- **🔌 Alova + Mock** — `@alova/mock` 前端攔截，整個前端流程不依賴後端即可運行
- **⚡ Vite 8** — 極速 HMR、Rolldown 加持
- **📦 自動匯入** — Vue / Pinia / Element Plus / Iconify 自動引入，無需手寫 import
- **♿ A11y** — 所有 icon 按鈕含 `aria-label`，i18n 同步
- **🎯 語言切換無位移** — 全域 CSS rules 鎖住主要元件尺寸，切語言不會跳版面

## 技術棧

| 類別 | 套件 |
|---|---|
| Build | Vite 8 |
| Framework | Vue 3.5 + TypeScript (`<script setup>`) |
| UI | Element Plus 2.14 |
| State | Pinia 3 (setup-store style) |
| Routing | Vue Router |
| i18n | vue-i18n 11 |
| HTTP | Alova 3 + @alova/mock |
| Icons | @iconify/vue + @iconify/json (mdi / circle-flags / heroicons) |
| Tooling | unplugin-auto-import + unplugin-vue-components |

## 快速開始

```bash
git clone https://github.com/Angelo0218/admin_test1.git
cd admin_test1
pnpm install
pnpm dev
```

開啟 http://localhost:5173/ 即可看到登入頁。

### 可用指令

```bash
pnpm dev          # 開發伺服器
pnpm typecheck    # TypeScript 型別檢查
pnpm build        # 產生 production 包到 dist/
pnpm preview      # 預覽 production 包
pnpm test:mock    # 跑 mock + alova end-to-end smoke test
```

## 測試帳號

| 帳號  | 密碼     | 角色   | 可見選單                       |
| ----- | -------- | ------ | ------------------------------ |
| admin | admin123 | admin  | Dashboard、列表、**管理員介面** |
| user  | user123  | user   | Dashboard、列表                |

兩種角色登入後選單自動依角色過濾；admin 多看到「管理員介面」。

## 專案結構

```
src/
├── api/               Alova 實例 + auth.ts + list.ts
├── components/        SvgIcon、LangSwitch、ThemeToggle、FullScreen
├── enum/              SetupStoreId、StorageKey、SUPPORTED_LANGS
├── layouts/
│   ├── BaseLayout.vue
│   └── modules/       Logo、Sider、Menu、Header、Breadcrumb、UserDropdown
├── locales/           langs/zh-tw、langs/en-us、index.ts（setLocale、$t）
├── mock/              @alova/mock handlers（auth、list）
├── router/            routes.ts、guard.ts、index.ts
├── store/
│   └── modules/       auth、app
├── styles/            element-plus 主題、global SCSS
├── typings/           app.d.ts、env.d.ts
├── utils/             storage.ts、auth.ts
├── views/
│   ├── _builtin/      login、403、404
│   ├── dashboard/
│   ├── list/
│   └── admin/         （Admin 角色限定）
├── App.vue
└── main.ts
```

## 權限模型

- 每個路由的 `meta.roles` 標記允許的角色陣列；省略代表任何登入者皆可。
- Navigation guard 依序檢查 `meta.constant`（免登入）→ `isLogin` → 角色比對。
- Sidebar 依 `meta.hideInMenu` 與 `meta.roles` 動態過濾選項，切角色或語言會即時更新。

## i18n 切換

Header 右上角的全球 icon 按鈕（`heroicons:language`）開啟 dropdown，列出每個語言的國旗 icon（`circle-flags:tw`、`circle-flags:us`）與語言名稱。切換後：

1. 寫入 localStorage（`admin_lang`）
2. 更新 `<html lang="...">` 屬性
3. 所有綁定 `$t(meta.title)` 的 sidebar / breadcrumb 即時更新

## 深色模式

ThemeToggle 元件切換 `<html>` 的 `dark` class，套用 Element Plus 內建 dark CSS variables 與自訂的 CSS variables（`--app-*`）。`index.html` 內含 pre-mount script，在 JS 載入前依 localStorage 設定主題，避免淺色閃爍（FOUC）。

## Mock 機制

`@alova/mock` 在 `VITE_USE_MOCK=true` 時透過 adapter 攔截所有 alova 請求並回傳 mock 資料。接真實 API：

1. 設 `VITE_USE_MOCK=false`
2. 設 `VITE_API_URL=https://your.api.com`
3. （可選）保留 mock 模組以便切換

## 環境需求

- Node 22+ (LTS)
- pnpm 10+
- Windows / macOS / Linux 皆可

## License

[MIT](LICENSE) © 2026 Angelo0218
