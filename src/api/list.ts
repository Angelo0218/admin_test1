import { alova } from './index'

export interface ListQuery {
  page: number
  pageSize: number
  keyword?: string
}

export async function fetchListData(query: ListQuery): Promise<Api.List.ListResponse> {
  const params: Record<string, unknown> = { ...query }
  return alova.Get<Api.List.ListResponse>('/list/data', { params, cacheFor: 0 })
}
