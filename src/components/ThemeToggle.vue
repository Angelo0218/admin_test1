<script setup lang="ts">
import { useAppStore } from '@/store'

const appStore = useAppStore()

const isDark = computed(() => appStore.themeMode === 'dark')

function toggle() {
  appStore.setThemeMode(isDark.value ? 'light' : 'dark')
}
</script>

<template>
  <el-tooltip
    :content="isDark ? $t('layout.themeLight') : $t('layout.themeDark')"
    placement="bottom"
  >
    <el-button circle plain :aria-label="$t('layout.theme')" @click="toggle">
      <SvgIcon :icon="isDark ? 'mdi:white-balance-sunny' : 'mdi:weather-night'" :size="18" />
    </el-button>
  </el-tooltip>
</template>
