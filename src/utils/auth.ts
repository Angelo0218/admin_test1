import { localStg } from './storage'
import { StorageKey } from '@/enum'

export function getToken(): string {
  return localStg.get(StorageKey.Token) || ''
}

export function setToken(token: string): void {
  localStg.set(StorageKey.Token, token)
}

export function clearToken(): void {
  localStg.remove(StorageKey.Token)
}
