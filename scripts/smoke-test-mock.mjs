import { createAlova } from 'alova'
import adapterFetch from 'alova/fetch'
import { createAlovaMockAdapter, defineMock } from '@alova/mock'

const ADMIN_TOKEN = 'mock-token-admin'
const admin = { userId: '1', userName: 'Admin', role: 'admin' }
const user = { userId: '2', userName: 'User', role: 'user' }

const authMock = defineMock({
  '[POST]/api/auth/login': ({ data }) => {
    if (data.username === 'admin' && data.password === 'admin123') {
      return { token: ADMIN_TOKEN, userInfo: admin }
    }
    if (data.username === 'user' && data.password === 'user123') {
      return { token: 'mock-token-user', userInfo: user }
    }
    return { status: 401, statusText: 'Unauthorized', body: { message: 'invalid credentials' } }
  },

  '[GET]/api/auth/me': ({ headers }) => {
    const auth = headers.Authorization || headers.authorization || ''
    if (auth.endsWith(ADMIN_TOKEN)) return admin
    if (auth.endsWith('mock-token-user')) return user
    return { status: 401, statusText: 'Unauthorized', body: { message: 'invalid token' } }
  }
})

let storedToken = ''

const alova = createAlova({
  baseURL: '/api',
  requestAdapter: createAlovaMockAdapter([authMock], { delay: 50, httpAdapter: adapterFetch() }),
  timeout: 5000,
  beforeRequest(method) {
    if (storedToken) method.config.headers.Authorization = `Bearer ${storedToken}`
    if (!method.config.headers['Content-Type']) method.config.headers['Content-Type'] = 'application/json'
  },
  responded: {
    onSuccess: async (response) => {
      const text = await response.text().catch(() => '')
      if (response.status >= 400) throw new Error(text || `HTTP ${response.status}`)
      if (!text) return undefined
      try { return JSON.parse(text) } catch { return text }
    },
    onError: (e) => { throw e }
  }
})

function assert(cond, msg) {
  if (!cond) { console.error('FAIL:', msg); process.exit(1) }
  console.log('PASS:', msg)
}

(async () => {
  try {
    const ok = await alova.Post('/auth/login', { username: 'admin', password: 'admin123' })
    assert(ok.token === ADMIN_TOKEN, 'admin login returns admin token')
    assert(ok.userInfo.role === 'admin', 'admin login returns admin role')

    storedToken = ok.token
    const me = await alova.Get('/auth/me', { cacheFor: 0 })
    assert(me.role === 'admin', 'GET /auth/me returns admin when token is admin')

    storedToken = ''
    let threw = false
    try {
      await alova.Post('/auth/login', { username: 'admin', password: 'wrong' })
    } catch (e) {
      threw = true
      assert(/invalid credentials/.test(e.message), '401 includes invalid credentials message')
    }
    assert(threw, 'wrong password throws')

    storedToken = 'bogus'
    let threw2 = false
    try {
      await alova.Get('/auth/me', { cacheFor: 0 })
    } catch (e) {
      threw2 = true
      assert(/invalid token/.test(e.message), '401 includes invalid token message')
    }
    assert(threw2, 'invalid token throws on /auth/me')

    console.log('\nALL TESTS PASSED')
  } catch (err) {
    console.error('Test crashed:', err)
    process.exit(1)
  }
})()
