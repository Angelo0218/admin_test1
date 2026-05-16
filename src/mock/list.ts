import { defineMock } from '@alova/mock'

const FIRST_NAMES = ['Alex', 'Jordan', 'Taylor', 'Morgan', 'Casey', 'Jamie', 'Riley', 'Avery', 'Quinn', 'Drew']
const LAST_NAMES = ['Smith', 'Johnson', 'Lee', 'Brown', 'Wang', 'Chen', 'Lin', 'Wu', 'Zhang', 'Liu']

function buildDataset(): Api.List.Row[] {
  const rows: Api.List.Row[] = []
  for (let i = 1; i <= 56; i++) {
    const first = FIRST_NAMES[i % FIRST_NAMES.length]
    const last = LAST_NAMES[(i * 3) % LAST_NAMES.length]
    const role: App.UserRole = i % 5 === 0 ? 'admin' : 'user'
    const status: Api.List.Row['status'] = i % 7 === 0 ? 'inactive' : 'active'
    const created = new Date(2025, i % 12, (i % 27) + 1, 9, (i * 7) % 60)
    rows.push({
      id: i,
      name: `${first} ${last}`,
      role,
      email: `${first.toLowerCase()}.${last.toLowerCase()}@example.com`,
      status,
      createdAt: created.toISOString().slice(0, 19).replace('T', ' ')
    })
  }
  return rows
}

const DATASET = buildDataset()

export const listMock = defineMock({
  '[GET]/api/list/data': ({ query }) => {
    const params = query as Record<string, string>
    const page = Number(params.page ?? '1')
    const pageSize = Number(params.pageSize ?? '10')
    const keyword = (params.keyword ?? '').trim().toLowerCase()

    let filtered = DATASET
    if (keyword) {
      filtered = DATASET.filter(
        (r) => r.name.toLowerCase().includes(keyword) || r.email.toLowerCase().includes(keyword)
      )
    }

    const start = (page - 1) * pageSize
    const list = filtered.slice(start, start + pageSize)

    return { total: filtered.length, list } satisfies Api.List.ListResponse
  }
})
