import { defineMock } from '@alova/mock'

const ADMIN_TOKEN = 'mock-token-admin'
const USER_TOKEN = 'mock-token-user'

const admin: App.UserInfo = { userId: '1', userName: 'Admin', role: 'admin' }
const user: App.UserInfo = { userId: '2', userName: 'User', role: 'user' }

export const authMock = defineMock({
  '[POST]/api/auth/login': ({ data }) => {
    const body = data as { username: string; password: string }
    if (body.username === 'admin' && body.password === 'admin123') {
      return { token: ADMIN_TOKEN, userInfo: admin }
    }
    if (body.username === 'user' && body.password === 'user123') {
      return { token: USER_TOKEN, userInfo: user }
    }
    return { status: 401, statusText: 'Unauthorized', body: { message: 'invalid credentials' } }
  },

  '[GET]/api/auth/me': ({ headers }) => {
    const headersMap = headers as Record<string, string>
    const auth = headersMap.Authorization || headersMap.authorization || ''
    if (auth.endsWith(ADMIN_TOKEN)) return admin
    if (auth.endsWith(USER_TOKEN)) return user
    return { status: 401, statusText: 'Unauthorized', body: { message: 'invalid token' } }
  }
})
