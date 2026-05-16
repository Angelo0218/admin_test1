import { ref, watch } from 'vue'
import { defineStore } from 'pinia'
import { localStg } from '@/utils/storage'
import { SetupStoreId, StorageKey } from '@/enum'

export const useAppStore = defineStore(SetupStoreId.App, () => {
  const siderCollapsed = ref(false)
  const themeMode = ref<App.Theme.ThemeMode>(localStg.get(StorageKey.ThemeMode) || 'light')

  function toggleSider() {
    siderCollapsed.value = !siderCollapsed.value
  }

  function setThemeMode(mode: App.Theme.ThemeMode) {
    themeMode.value = mode
    localStg.set(StorageKey.ThemeMode, mode)
  }

  function applyTheme() {
    const isDark =
      themeMode.value === 'dark' ||
      (themeMode.value === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches)
    document.documentElement.classList.toggle('dark', isDark)
  }

  watch(themeMode, applyTheme, { immediate: true })

  return {
    siderCollapsed,
    themeMode,
    toggleSider,
    setThemeMode,
    applyTheme
  }
})
