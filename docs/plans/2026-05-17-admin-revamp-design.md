# Admin 介面強化設計：角色管理 + 稽核紀錄

> 日期：2026-05-17
> 對應需求：把現有 `/admin` 概覽頁替換為功能完整的「角色管理」表格，並新增「稽核紀錄」表格頁。

## 目標

讓「管理員」角色的功能完善——不再是純展示的概覽卡片，而是兩個可實際操作的管理頁。

## 路由與選單

| Path | Name | Title key | Icon | Roles |
|---|---|---|---|---|
| `/role-mgmt` | role-mgmt | route.roleMgmt | mdi:account-cog | admin |
| `/audit-log` | audit-log | route.auditLog | mdi:clipboard-text-clock | admin |

兩者為頂層 admin-only 路由（並列於 sidebar，不分層）。舊 `/admin` 路由與 `src/views/admin/` 整個移除。

## 角色管理頁

### 資料模型

```ts
namespace Api.Role {
  interface Row {
    id: number
    code: string          // 唯一識別：admin / editor...
    name: string
    description: string
    userCount: number     // 唯讀
    enabled: boolean
    builtin: boolean      // 內建角色不可刪
    createdAt: string
  }
}
```

### 表格

| # | 代碼 | 名稱 | 描述 | 使用者數 | 狀態 | 建立時間 | 操作 |

頂部工具列：`新增` 按鈕、關鍵字搜尋（code/name）、重新整理。

### 表單（RoleForm dialog）

| 欄位 | 規則 |
|---|---|
| code | 必填、3-20 字、英數加底線、唯一；編輯時 disabled |
| name | 必填、1-30 字 |
| description | textarea，<200 字 |
| enabled | el-switch |

### 刪除規則

`builtin: true` 的角色（admin、user）回 400 不可刪。其他可刪。

### Mock API

- `[GET] /api/role/list?page&pageSize&keyword`
- `[POST] /api/role`
- `[PUT] /api/role/:id`
- `[DELETE] /api/role/:id`

### 初始資料

admin、user（builtin）、editor、viewer + 6 筆 demo 資料以演示分頁。

## 稽核紀錄頁

### 資料模型

```ts
namespace Api.AuditLog {
  type Action = 'login' | 'logout' | 'create_role' | 'update_role' | 'delete_role' | 'view_list' | 'export'
  type Status = 'success' | 'failed'

  interface Row {
    id: number
    operator: string
    operatorRole: App.UserRole
    action: Action
    target: string
    ip: string
    status: Status
    durationMs: number
    createdAt: string
  }

  interface Detail extends Row {
    userAgent: string
    requestPayload: Record<string, unknown> | null
    responseSnippet: string
  }
}
```

### 表格

| # | 時間 | 操作者 | 動作 | 目標 | IP | 狀態 | 操作（詳情） |

### 篩選列

動作類型、操作者、狀態、日期區間。

### 詳情 Drawer（LogDetail）

- 顯示所有欄位 + User-Agent + duration
- Request payload / Response snippet 以 `<pre>` 顯示 JSON

### Mock API

- `[GET] /api/audit-log/list?page&pageSize&action&operator&status&dateFrom&dateTo`
- `[GET] /api/audit-log/:id`

### 資料集

80 筆，跨最近 14 天，含 7 種動作，5-10% 失敗。

## 連動更新

| 檔案 | 變更 |
|---|---|
| `src/router/routes.ts` | 移除 `/admin`，新增 `/role-mgmt`、`/audit-log` |
| `src/locales/langs/*.ts` | 移除 `page.admin.*`、`route.admin`；新增 roleMgmt / auditLog 區塊 |
| `src/views/dashboard/index.vue` | admin 角色的 `visibleMenus` 補上兩個新項 |
| `src/typings/app.d.ts` | 新增 `Api.Role`、`Api.AuditLog` namespace |
| `src/api/index.ts` | 註冊 `roleMock`、`auditLogMock` |

## 取捨

- 「權限設定」頁面與功能不做（按需求）
- 稽核紀錄不開放編輯/刪除（符合現實——log 不該手動改）
- 不為新 mock 撰寫額外的 smoke test（既有 auth/list 已涵蓋 mock + alova 鏈路）

## 環境

不變。Node 22+、pnpm 10+。
