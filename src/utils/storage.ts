interface StorageMap {
  token: string
  lang: App.I18n.LangType
  theme_mode: App.Theme.ThemeMode
}

const PREFIX = 'admin_'

function createStorage() {
  const store = window.localStorage

  return {
    get<K extends keyof StorageMap>(key: K): StorageMap[K] | null {
      const raw = store.getItem(PREFIX + key)
      if (raw === null) return null
      try {
        const parsed = JSON.parse(raw) as { value: StorageMap[K] }
        return parsed.value
      } catch {
        return null
      }
    },

    set<K extends keyof StorageMap>(key: K, value: StorageMap[K]): void {
      store.setItem(PREFIX + key, JSON.stringify({ value }))
    },

    remove<K extends keyof StorageMap>(key: K): void {
      store.removeItem(PREFIX + key)
    },

    clear(): void {
      const keysToRemove: string[] = []
      for (let i = 0; i < store.length; i++) {
        const k = store.key(i)
        if (k && k.startsWith(PREFIX)) keysToRemove.push(k)
      }
      keysToRemove.forEach((k) => store.removeItem(k))
    }
  }
}

export const localStg = createStorage()
