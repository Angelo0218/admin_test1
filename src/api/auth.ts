import { alova } from './index'

export async function fetchLogin(username: string, password: string): Promise<Api.Auth.LoginResponse> {
  return alova.Post<Api.Auth.LoginResponse>('/auth/login', { username, password })
}

export async function fetchUserInfo(): Promise<App.UserInfo> {
  return alova.Get<App.UserInfo>('/auth/me', { cacheFor: 0 })
}
