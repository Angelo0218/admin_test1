import { alova } from './index'

export interface RoleListQuery {
  page: number
  pageSize: number
  keyword?: string
}

export async function fetchRoleList(query: RoleListQuery): Promise<Api.Role.ListResponse> {
  const params: Record<string, unknown> = { ...query }
  return alova.Get<Api.Role.ListResponse>('/role/list', { params, cacheFor: 0 })
}

export async function createRole(payload: Api.Role.CreatePayload): Promise<Api.Role.Row> {
  return alova.Post<Api.Role.Row>('/role', payload)
}

export async function updateRole(id: number, payload: Api.Role.UpdatePayload): Promise<Api.Role.Row> {
  return alova.Put<Api.Role.Row>(`/role/${id}`, payload)
}

export async function deleteRole(id: number): Promise<{ id: number }> {
  return alova.Delete<{ id: number }>(`/role/${id}`)
}
