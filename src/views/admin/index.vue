<script setup lang="ts">
import { $t } from '@/locales'

type SectionTone = 'primary' | 'success' | 'warning'

interface AdminSection {
  key: string
  icon: string
  tone: SectionTone
  label: string
  desc: string
}

const sections = computed<AdminSection[]>(() => [
  {
    key: 'roles',
    icon: 'mdi:account-cog-outline',
    tone: 'primary',
    label: $t('page.admin.sections.roles'),
    desc: $t('page.admin.roleDesc')
  },
  {
    key: 'permissions',
    icon: 'mdi:key-chain-variant',
    tone: 'success',
    label: $t('page.admin.sections.permissions'),
    desc: $t('page.admin.permissionDesc')
  },
  {
    key: 'audit',
    icon: 'mdi:clipboard-text-clock-outline',
    tone: 'warning',
    label: $t('page.admin.sections.audit'),
    desc: $t('page.admin.auditDesc')
  }
])
</script>

<template>
  <div class="app-page admin-page">
    <section class="admin-page__hero app-card">
      <div class="admin-page__hero-icon">
        <SvgIcon icon="mdi:shield-account" :size="34" color="var(--el-color-primary)" />
      </div>
      <div>
        <h2 class="admin-page__title">{{ $t('page.admin.title') }}</h2>
        <p class="admin-page__subtitle">{{ $t('page.admin.subtitle') }}</p>
      </div>
    </section>

    <section class="admin-page__grid">
      <div
        v-for="s in sections"
        :key="s.key"
        class="admin-page__section app-card"
        :class="`admin-page__section--${s.tone}`"
      >
        <div class="admin-page__section-icon">
          <SvgIcon :icon="s.icon" :size="24" />
        </div>
        <div class="admin-page__section-body">
          <h3 class="admin-page__section-title">{{ s.label }}</h3>
          <p class="admin-page__section-desc">{{ s.desc }}</p>
        </div>
        <el-button text type="primary" :aria-label="s.label">
          <SvgIcon icon="mdi:arrow-right" :size="18" />
        </el-button>
      </div>
    </section>
  </div>
</template>

<style scoped lang="scss">
.admin-page {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.admin-page__hero {
  display: flex;
  align-items: center;
  gap: 16px;
}

.admin-page__hero-icon {
  width: 64px;
  height: 64px;
  border-radius: 12px;
  background-color: var(--el-color-primary-light-9);
  display: flex;
  align-items: center;
  justify-content: center;
}

.admin-page__title {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
}

.admin-page__subtitle {
  margin: 6px 0 0;
  color: var(--el-text-color-secondary);
  font-size: 13px;
}

.admin-page__grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 12px;
}

.admin-page__section {
  display: flex;
  align-items: center;
  gap: 14px;
}

.admin-page__section-icon {
  width: 48px;
  height: 48px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  background-color: var(--section-bg);
  color: var(--section-fg);
}

.admin-page__section--primary {
  --section-bg: var(--el-color-primary-light-9);
  --section-fg: var(--el-color-primary);
}

.admin-page__section--success {
  --section-bg: var(--el-color-success-light-9);
  --section-fg: var(--el-color-success);
}

.admin-page__section--warning {
  --section-bg: var(--el-color-warning-light-9);
  --section-fg: var(--el-color-warning);
}

.admin-page__section-body {
  flex: 1;
  min-width: 0;
}

.admin-page__section-title {
  margin: 0;
  font-size: 15px;
  font-weight: 600;
  white-space: nowrap;
}

.admin-page__section-desc {
  margin: 4px 0 0;
  font-size: 12px;
  color: var(--el-text-color-secondary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
