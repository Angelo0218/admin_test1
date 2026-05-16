import { alova } from './index'

export interface AuditLogListQuery {
  page: number
  pageSize: number
  action?: Api.AuditLog.Action | ''
  operator?: string
  status?: Api.AuditLog.Status | ''
  dateFrom?: string
  dateTo?: string
}

export async function fetchAuditLogList(
  query: AuditLogListQuery
): Promise<Api.AuditLog.ListResponse> {
  const params: Record<string, unknown> = { ...query }
  return alova.Get<Api.AuditLog.ListResponse>('/audit-log/list', { params, cacheFor: 0 })
}

export async function fetchAuditLogDetail(id: number): Promise<Api.AuditLog.Detail> {
  return alova.Get<Api.AuditLog.Detail>(`/audit-log/${id}`, { cacheFor: 0 })
}
