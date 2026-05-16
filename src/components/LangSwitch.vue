<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { SUPPORTED_LANGS } from '@/enum'
import { setLocale } from '@/locales'

const { locale } = useI18n()

function onSelect(key: App.I18n.LangType) {
  if (key === locale.value) return
  setLocale(key)
}
</script>

<template>
  <el-dropdown trigger="hover" placement="bottom-end" @command="onSelect">
    <el-button circle plain :aria-label="$t('layout.lang')" class="lang-btn">
      <SvgIcon icon="heroicons:language" :size="18" />
    </el-button>

    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item
          v-for="lang in SUPPORTED_LANGS"
          :key="lang.key"
          :command="lang.key"
          :class="{ 'is-active': lang.key === locale }"
        >
          <span class="lang-item">
            <SvgIcon :icon="lang.flag" :size="18" />
            <span>{{ lang.label }}</span>
            <SvgIcon v-if="lang.key === locale" icon="mdi:check" :size="16" class="lang-check" />
          </span>
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<style scoped lang="scss">
.lang-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.lang-item {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-width: 120px;
}

.lang-check {
  margin-left: auto;
  color: var(--el-color-primary);
}

.is-active {
  color: var(--el-color-primary);
}
</style>
