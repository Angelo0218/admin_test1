export const SetupStoreId = {
  Auth: 'auth',
  App: 'app'
} as const

export const StorageKey = {
  Token: 'token',
  Lang: 'lang',
  ThemeMode: 'theme_mode'
} as const

export const SUPPORTED_LANGS: App.I18n.LangOption[] = [
  { key: 'zh-TW', label: '繁體中文', flag: 'circle-flags:tw' },
  { key: 'en-US', label: 'English', flag: 'circle-flags:us' }
]
