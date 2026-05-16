import { defineMock } from '@alova/mock'

const ACTIONS: Api.AuditLog.Action[] = [
  'login',
  'logout',
  'create_role',
  'update_role',
  'delete_role',
  'view_list',
  'export'
]

const USER_AGENT_POOL = [
  'Mozilla/5.0 (Windows NT 11.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_5) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Safari/605.1.15',
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36'
]

type MockLog = Api.AuditLog.Detail

function pad2(value: number): string {
  return value.toString().padStart(2, '0')
}

function formatTime(d: Date): string {
  return (
    `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())} ` +
    `${pad2(d.getHours())}:${pad2(d.getMinutes())}:${pad2(d.getSeconds())}`
  )
}

function targetFor(action: Api.AuditLog.Action, seed: number): string {
  switch (action) {
    case 'create_role':
    case 'update_role':
    case 'delete_role':
      return `role:${['editor', 'viewer', 'auditor', 'finance'][seed % 4]}`
    case 'view_list':
      return 'user-list'
    case 'export':
      return 'audit-log.csv'
    case 'login':
    case 'logout':
    default:
      return '-'
  }
}

function payloadFor(action: Api.AuditLog.Action): Record<string, unknown> | null {
  switch (action) {
    case 'login':
      return { username: 'admin' }
    case 'logout':
      return null
    case 'create_role':
      return { code: 'editor', name: '編輯員', enabled: true }
    case 'update_role':
      return { id: 5, name: '稽核員（修正）' }
    case 'delete_role':
      return { id: 9 }
    case 'view_list':
      return { page: 1, pageSize: 10 }
    case 'export':
      return { format: 'csv', range: 'last_7_days' }
  }
}

function responseFor(action: Api.AuditLog.Action, status: Api.AuditLog.Status): string {
  if (status === 'failed') {
    return JSON.stringify({ error: 'permission denied' })
  }
  switch (action) {
    case 'login':
      return JSON.stringify({ token: 'mock-token-...', userInfo: { role: 'admin' } })
    case 'create_role':
      return JSON.stringify({ id: 11, code: 'editor' })
    case 'update_role':
      return JSON.stringify({ id: 5, updated: true })
    case 'delete_role':
      return JSON.stringify({ id: 9, deleted: true })
    case 'view_list':
      return JSON.stringify({ total: 56, listLength: 10 })
    case 'export':
      return JSON.stringify({ url: 'https://files.example.com/export-2026-05-17.csv' })
    case 'logout':
      return JSON.stringify({ ok: true })
  }
}

function buildDataset(): MockLog[] {
  const rows: MockLog[] = []
  const now = Date.now()
  for (let i = 80; i >= 1; i--) {
    const action = ACTIONS[(i * 3) % ACTIONS.length]
    const isFailed = i % 13 === 0
    const status: Api.AuditLog.Status = isFailed ? 'failed' : 'success'
    const operator = i % 4 === 0 ? 'User' : 'Admin'
    const operatorRole: App.UserRole = operator === 'Admin' ? 'admin' : 'user'
    const minutesAgo = i * 47 + (i % 7) * 13
    const createdAt = formatTime(new Date(now - minutesAgo * 60_000))

    rows.push({
      id: i,
      operator,
      operatorRole,
      action,
      target: targetFor(action, i),
      ip: `192.168.${(i % 5) + 1}.${(i * 7) % 250 + 1}`,
      status,
      durationMs: 30 + ((i * 17) % 400),
      createdAt,
      userAgent: USER_AGENT_POOL[i % USER_AGENT_POOL.length],
      requestPayload: payloadFor(action),
      responseSnippet: responseFor(action, status)
    })
  }
  return rows
}

const DATASET = buildDataset()

function tsToDateOnly(ts: string): string {
  return ts.slice(0, 10)
}

export const auditLogMock = defineMock({
  '[GET]/api/audit-log/list': ({ query }) => {
    const params = query as Record<string, string>
    const page = Number(params.page ?? '1')
    const pageSize = Number(params.pageSize ?? '10')
    const action = (params.action ?? '').trim()
    const operator = (params.operator ?? '').trim().toLowerCase()
    const status = (params.status ?? '').trim()
    const dateFrom = (params.dateFrom ?? '').trim()
    const dateTo = (params.dateTo ?? '').trim()

    let filtered = DATASET
    if (action) filtered = filtered.filter((r) => r.action === action)
    if (operator) filtered = filtered.filter((r) => r.operator.toLowerCase().includes(operator))
    if (status) filtered = filtered.filter((r) => r.status === status)
    if (dateFrom) filtered = filtered.filter((r) => tsToDateOnly(r.createdAt) >= dateFrom)
    if (dateTo) filtered = filtered.filter((r) => tsToDateOnly(r.createdAt) <= dateTo)

    const start = (page - 1) * pageSize
    const list = filtered.slice(start, start + pageSize).map<Api.AuditLog.Row>((r) => ({
      id: r.id,
      operator: r.operator,
      operatorRole: r.operatorRole,
      action: r.action,
      target: r.target,
      ip: r.ip,
      status: r.status,
      durationMs: r.durationMs,
      createdAt: r.createdAt
    }))

    return { total: filtered.length, list } satisfies Api.AuditLog.ListResponse
  },

  '[GET]/api/audit-log/{id}': ({ params }) => {
    const id = Number((params as Record<string, string>).id)
    const row = DATASET.find((r) => r.id === id)
    if (!row) {
      return {
        status: 404,
        statusText: 'Not Found',
        body: { code: 'NOT_FOUND', message: 'log not found' }
      }
    }
    return row satisfies Api.AuditLog.Detail
  }
})
