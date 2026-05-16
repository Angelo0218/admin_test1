# Admin 管理介面設計文件

> 日期：2026-05-16
> 對應需求：老闆要求做一個前端登入頁面，兩個帳號權限看到不同選單
> 參考專案：`../soybean-admin`（吸收結構模式，UI 改用 Element Plus）

## 1. 目標

建立一個前端 admin 範本，包含登入頁與三個內頁；兩種角色（admin / user）登入後看到不同選單。

| 帳號 | 密碼 | 角色 | 可見選單 |
|---|---|---|---|
| `admin` | `admin123` | admin | Dashboard、列表頁、管理員介面 |
| `user`  | `user123`  | user  | Dashboard、列表頁 |

## 2. 技術棧

| 類別 | 選擇 |
|---|---|
| 建構 | Vite 5 |
| 框架 | Vue 3.5 + TypeScript 5（`<script setup>`） |
| UI | Element Plus 2.8+ |
| 狀態 | Pinia 2（setup-store style） |
| 路由 | Vue Router 4 |
| 國際化 | vue-i18n 9（zh-TW / en-US） |
| HTTP | Alova 3 + @alova/mock |
| 圖示 | unplugin-icons + @iconify/json（含 `mdi`、`circle-flags`、`heroicons` 集） |
| 自動匯入 | unplugin-auto-import + unplugin-vue-components |
| Lint | ESLint + Prettier |

## 3. 專案結構

```
admin/
├── public/
├── src/
│   ├── api/                    Alova 實例 + auth.ts + user.ts
│   ├── assets/
│   ├── components/             共用元件：LangSwitch、ThemeToggle、SvgIcon
│   ├── enum/                   SetupStoreId、StorageKey
│   ├── hooks/                  useLoading
│   ├── layouts/
│   │   ├── BaseLayout.vue
│   │   ├── BlankLayout.vue
│   │   └── modules/            Header、Sider、Menu、Logo、UserDropdown
│   ├── locales/
│   │   ├── langs/              zh-tw.ts、en-us.ts
│   │   └── index.ts
│   ├── mock/                   @alova/mock handlers
│   ├── router/
│   │   ├── routes.ts
│   │   ├── guard.ts
│   │   └── index.ts
│   ├── store/
│   │   ├── modules/            auth、app
│   │   └── index.ts
│   ├── styles/                 SCSS、Element Plus theme
│   ├── typings/                app.d.ts、api.d.ts、env.d.ts
│   ├── utils/                  storage.ts、auth.ts
│   ├── views/
│   │   ├── _builtin/           login、403、404
│   │   ├── dashboard/
│   │   ├── list/
│   │   └── admin/
│   ├── App.vue
│   └── main.ts
├── .env.dev、.env.prod
├── eslint.config.js
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## 4. 驗證與權限

### Auth Store（setup-store 風格）

```ts
export const useAuthStore = defineStore(SetupStoreId.Auth, () => {
  const token = ref('')
  const userInfo = reactive<UserInfo>({ userId: '', userName: '', role: 'user' })
  const isLogin = computed(() => Boolean(token.value))

  async function login(username: string, password: string)
  async function resetStore()
  async function initUserInfo()

  return { token, userInfo, isLogin, login, resetStore, initUserInfo }
})
```

### 啟動流程

```
main.ts → setupStore → setupI18n → setupRouter
       → router.isReady() 前 await authStore.initUserInfo()（重整保留登入）
```

### Token 儲存

- localStorage 經型別安全的 `localStg` 工具存取
- Alova request 攔截器自動掛 `Authorization: Bearer <token>`
- 401 → 呼叫 `authStore.resetStore()` 跳回 /login

## 5. 路由與選單

### Route Meta 規範

| 欄位 | 用途 |
|---|---|
| `title` | i18n key（切語言即時更新） |
| `icon` | Iconify 名稱（如 `mdi:view-dashboard`） |
| `roles` | 允許角色陣列；省略=任何登入者 |
| `constant` | true=免登入頁 |
| `hideInMenu` | true=不顯示在 sidebar |

### Routes 清單

| Path | Roles | Title key | Icon |
|---|---|---|---|
| `/login` | (constant) | route.login | — |
| `/403` | (constant) | route.noPermission | — |
| `/dashboard` | admin, user | route.dashboard | mdi:view-dashboard |
| `/list` | admin, user | route.list | mdi:table |
| `/admin` | **admin** | route.admin | mdi:shield-account |

### Guard 邏輯

```
beforeEach(to):
  meta.constant → pass
  !isLogin → 跳 /login?redirect=to.fullPath
  meta.roles && !roles.includes(role) → 跳 /403
  else → pass
```

### Sidebar 渲染

從 `router.options.routes` 的 children 過濾 `hideInMenu` 與 `roles`，動態渲染 `el-menu-item`。切角色或語言自動 reactive 更新。

## 6. 國際化

### 語言切換器 (`LangSwitch.vue`)

- `el-dropdown` trigger 內放圖示按鈕（globe icon: `heroicons:language`）
- Dropdown 項目左側放國旗 icon（`circle-flags:tw`、`circle-flags:us`），右側放語言名稱
- 選擇後呼叫 `setLocale(lang)`，即時切換、寫入 localStorage、更新 `<html lang>` 屬性

### 語言包結構

```
locales/langs/zh-tw.ts
locales/langs/en-us.ts
```

每個 key 命名規範：`route.*`、`page.login.*`、`common.*`、`icon.*`

## 7. Alova + Mock

### 實例設定

```ts
const alova = createAlova({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  statesHook: VueHook,
  requestAdapter: import.meta.env.DEV
    ? createAlovaMockAdapter([authMock], { delay: 300 })
    : adapterFetch(),
  beforeRequest({ config }) {
    const token = localStg.get('token')
    if (token) config.headers.Authorization = `Bearer ${token}`
  },
  responded: {
    onSuccess: async (res) => {
      if (res.status === 401) { useAuthStore().resetStore() }
      return res.json()
    }
  }
})
```

### Mock Handlers

- `[POST] /auth/login` → 比對 admin/admin123 或 user/user123，回 token + userInfo
- `[GET] /auth/me` → 依 Authorization header 中的 token 判斷 admin 或 user
- `[GET] /list/data` → 回固定假資料供列表頁 demo

## 8. UI Layout

```
┌──────────────────────────────────────────────────┐
│ Sider                  │ Header                  │
│ ┌────────┐             │ 麵包屑 · 右側工具列     │
│ │  Logo  │             │ (Lang Theme FullScreen │
│ └────────┘             │  UserDropdown)          │
│ ◉ Dashboard            ├─────────────────────────┤
│ ◉ 列表頁               │                         │
│ ◉ 管理員介面 (admin)   │  <router-view/>         │
│                        │                         │
└──────────────────────────────────────────────────┘
```

- Sider 寬 220px，可摺疊（icon-only mode）
- Header 高 56px，sticky top
- 主色用 Element Plus 預設藍 (#409EFF)，後續可改 CSS var
- Dark mode 用 Element Plus 內建 `dark` class
- 圓角 6px，字體系統 stack（無多餘字型載入）

## 9. 實作里程碑

1. 專案骨架 + 套件安裝
2. Vite 設定（alias、auto-import、icons、proxy）
3. 基礎建設（typings、enum、utils、storage）
4. i18n（locale 檔 + setLocale + $t）
5. Pinia auth store
6. Alova 實例 + mock handlers
7. Router routes + guard
8. Layouts（Base、Blank）+ modules（Sider、Header、Menu、UserDropdown）
9. 共用元件（LangSwitch、ThemeToggle、SvgIcon）
10. Views（login、403、404、dashboard、list、admin）
11. SCSS 主題、global styles
12. README、啟動驗證、typecheck、build

## 10. 簡化的取捨

vs soybean-admin：
- 去掉 elegant-router（手寫路由表）
- 去掉 tab store、theme-drawer、ECharts、UnoCSS、MFA、refresh token
- 不分 components/common 與 components/custom
- 不分 service/api 與 service/request（合併到 `api/`）
- 不分 hooks/common 與 hooks/business

保留：Pinia setup-store style、`$t` 全域函式、layouts/modules 模組化、localStg、views/_builtin 慣例。

## 11. 環境

- Node 20.19+
- pnpm 10+
- Windows 11 開發機（PowerShell）
