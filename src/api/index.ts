import { createAlova } from 'alova'
import VueHook from 'alova/vue'
import adapterFetch from 'alova/fetch'
import { createAlovaMockAdapter } from '@alova/mock'
import { authMock } from '@/mock/auth'
import { listMock } from '@/mock/list'
import { roleMock } from '@/mock/role'
import { auditLogMock } from '@/mock/audit-log'
import { getToken } from '@/utils/auth'

const useMock = import.meta.env.VITE_USE_MOCK === 'true'

const requestAdapter = useMock
  ? createAlovaMockAdapter([authMock, listMock, roleMock, auditLogMock], {
      delay: 250,
      httpAdapter: adapterFetch(),
      mockRequestLogger: import.meta.env.DEV
    })
  : adapterFetch()

export const alova = createAlova({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  statesHook: VueHook,
  requestAdapter,
  timeout: 15_000,
  beforeRequest(method) {
    const token = getToken()
    if (token) method.config.headers.Authorization = `Bearer ${token}`
    if (!method.config.headers['Content-Type']) {
      method.config.headers['Content-Type'] = 'application/json'
    }
  },
  responded: {
    onSuccess: async (response) => {
      const text = await response.text().catch(() => '')

      if (response.status === 401) {
        if (getToken()) {
          const { useAuthStore } = await import('@/store')
          await useAuthStore().resetStore()
        }
        throw new Error(text || 'Unauthorized')
      }
      if (response.status >= 400) {
        throw new Error(text || `HTTP ${response.status}`)
      }

      if (!text) return undefined
      try {
        return JSON.parse(text)
      } catch {
        return text
      }
    },
    onError(error) {
      throw error instanceof Error ? error : new Error(String(error))
    }
  }
})
