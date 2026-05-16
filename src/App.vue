<script setup lang="ts">
import { ElConfigProvider } from 'element-plus'
import { useI18n } from 'vue-i18n'
import zhTw from 'element-plus/es/locale/lang/zh-tw'
import enUs from 'element-plus/es/locale/lang/en'
import { useAppStore } from '@/store'

const { locale } = useI18n()
const appStore = useAppStore()

const elementLocale = computed(() => (locale.value === 'zh-TW' ? zhTw : enUs))

onMounted(() => {
  appStore.applyTheme()
})
</script>

<template>
  <ElConfigProvider :locale="elementLocale" size="default">
    <router-view />
  </ElConfigProvider>
</template>
