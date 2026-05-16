import type { App as VueApp } from 'vue'
import type { Composer } from 'vue-i18n'
import { createI18n } from 'vue-i18n'
import zhTw from './langs/zh-tw'
import enUs from './langs/en-us'
import { localStg } from '@/utils/storage'
import { StorageKey } from '@/enum'

const messages = {
  'zh-TW': zhTw,
  'en-US': enUs
}

const i18n = createI18n({
  legacy: false,
  locale: localStg.get(StorageKey.Lang) || 'zh-TW',
  fallbackLocale: 'en-US',
  messages,
  globalInjection: true
})

function composer(): Composer {
  return i18n.global as unknown as Composer
}

export function setupI18n(app: VueApp) {
  app.use(i18n)
}

export const $t = composer().t.bind(composer()) as Composer['t']

export function setLocale(lang: App.I18n.LangType) {
  composer().locale.value = lang
  localStg.set(StorageKey.Lang, lang)
  document.querySelector('html')?.setAttribute('lang', lang)
}

export function getLocale(): App.I18n.LangType {
  return composer().locale.value as App.I18n.LangType
}

export { i18n }
