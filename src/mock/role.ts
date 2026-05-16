import { defineMock } from '@alova/mock'

const CODE_PATTERN = /^[A-Za-z0-9_]{3,20}$/

function makeRow(
  id: number,
  code: string,
  name: string,
  description: string,
  userCount: number,
  enabled: boolean,
  builtin: boolean,
  daysAgo: number
): Api.Role.Row {
  const d = new Date()
  d.setDate(d.getDate() - daysAgo)
  return {
    id,
    code,
    name,
    description,
    userCount,
    enabled,
    builtin,
    createdAt: d.toISOString().slice(0, 19).replace('T', ' ')
  }
}

const dataset: Api.Role.Row[] = [
  makeRow(1, 'admin', '管理員', '系統最高權限，可管理所有資源', 1, true, true, 30),
  makeRow(2, 'user', '一般使用者', '一般功能存取，無管理權限', 1, true, true, 30),
  makeRow(3, 'editor', '編輯員', '可建立與編輯內容', 0, true, false, 14),
  makeRow(4, 'viewer', '檢視員', '僅可檢視，不可修改', 0, false, false, 10),
  makeRow(5, 'auditor', '稽核員', '檢視稽核紀錄與報表', 0, true, false, 7),
  makeRow(6, 'finance', '財務人員', '存取財務模組與報表', 0, true, false, 6),
  makeRow(7, 'support', '客服', '檢視客戶資料與支援工單', 0, true, false, 5),
  makeRow(8, 'manager', '部門主管', '管理所屬部門使用者', 0, true, false, 4),
  makeRow(9, 'guest', '訪客', '受限存取，僅公開頁面', 0, false, false, 3),
  makeRow(10, 'developer', '開發者', '可存取開發者工具與 API', 0, true, false, 2)
]

let nextId = dataset.length + 1

function asString(value: unknown): string {
  return typeof value === 'string' ? value : ''
}

function asBoolean(value: unknown): boolean {
  return Boolean(value)
}

export const roleMock = defineMock({
  '[GET]/api/role/list': ({ query }) => {
    const params = query as Record<string, string>
    const page = Number(params.page ?? '1')
    const pageSize = Number(params.pageSize ?? '10')
    const keyword = (params.keyword ?? '').trim().toLowerCase()

    let filtered = dataset
    if (keyword) {
      filtered = dataset.filter(
        (r) => r.code.toLowerCase().includes(keyword) || r.name.toLowerCase().includes(keyword)
      )
    }

    const start = (page - 1) * pageSize
    const list = filtered.slice(start, start + pageSize)

    return { total: filtered.length, list } satisfies Api.Role.ListResponse
  },

  '[POST]/api/role': ({ data }) => {
    const payload = data as Partial<Api.Role.CreatePayload>
    const code = asString(payload.code).trim()
    const name = asString(payload.name).trim()
    const description = asString(payload.description).trim()
    const enabled = asBoolean(payload.enabled)

    if (!CODE_PATTERN.test(code)) {
      return {
        status: 400,
        statusText: 'Bad Request',
        body: { code: 'INVALID_CODE_FORMAT', field: 'code', message: 'invalid code format' }
      }
    }
    if (!name || name.length > 30) {
      return {
        status: 400,
        statusText: 'Bad Request',
        body: { code: 'INVALID_NAME_LENGTH', field: 'name', message: 'invalid name length' }
      }
    }
    if (dataset.some((r) => r.code === code)) {
      return {
        status: 409,
        statusText: 'Conflict',
        body: { code: 'DUPLICATE_CODE', field: 'code', message: 'code already exists' }
      }
    }

    const row: Api.Role.Row = {
      id: nextId++,
      code,
      name,
      description,
      userCount: 0,
      enabled,
      builtin: false,
      createdAt: new Date().toISOString().slice(0, 19).replace('T', ' ')
    }
    dataset.unshift(row)
    return row
  },

  '[PUT]/api/role/{id}': ({ params, data }) => {
    const id = Number((params as Record<string, string>).id)
    const target = dataset.find((r) => r.id === id)
    if (!target) {
      return {
        status: 404,
        statusText: 'Not Found',
        body: { code: 'NOT_FOUND', message: 'role not found' }
      }
    }
    const payload = data as Partial<Api.Role.UpdatePayload>
    const name = asString(payload.name).trim()
    if (!name || name.length > 30) {
      return {
        status: 400,
        statusText: 'Bad Request',
        body: { code: 'INVALID_NAME_LENGTH', field: 'name', message: 'invalid name length' }
      }
    }
    target.name = name
    target.description = asString(payload.description).trim()
    target.enabled = asBoolean(payload.enabled)
    return target
  },

  '[DELETE]/api/role/{id}': ({ params }) => {
    const id = Number((params as Record<string, string>).id)
    const idx = dataset.findIndex((r) => r.id === id)
    if (idx < 0) {
      return {
        status: 404,
        statusText: 'Not Found',
        body: { code: 'NOT_FOUND', message: 'role not found' }
      }
    }
    if (dataset[idx].builtin) {
      return {
        status: 400,
        statusText: 'Bad Request',
        body: {
          code: 'BUILTIN_NOT_DELETABLE',
          name: dataset[idx].name,
          message: 'built-in role cannot be deleted'
        }
      }
    }
    const [removed] = dataset.splice(idx, 1)
    return { id: removed.id }
  }
})
