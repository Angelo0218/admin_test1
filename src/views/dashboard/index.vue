<script setup lang="ts">
import { useAuthStore } from '@/store'
import { $t } from '@/locales'

const authStore = useAuthStore()

type StatTone = 'primary' | 'success' | 'warning' | 'danger'

interface Stat {
  key: string
  icon: string
  value: string
  tone: StatTone
}

const stats = computed<Stat[]>(() => [
  { key: 'totalUsers', icon: 'mdi:account-group-outline', value: '1,284', tone: 'primary' },
  { key: 'todayLogins', icon: 'mdi:login-variant', value: '328', tone: 'success' },
  { key: 'activeSessions', icon: 'mdi:lan-connect', value: '42', tone: 'warning' },
  { key: 'systemHealth', icon: 'mdi:heart-pulse', value: '99.8%', tone: 'danger' }
])

const visibleMenus = computed(() => {
  if (authStore.userInfo.role === 'admin') {
    return [
      { icon: 'mdi:view-dashboard', label: $t('route.dashboard') },
      { icon: 'mdi:table', label: $t('route.list') },
      { icon: 'mdi:shield-account', label: $t('route.admin') }
    ]
  }
  return [
    { icon: 'mdi:view-dashboard', label: $t('route.dashboard') },
    { icon: 'mdi:table', label: $t('route.list') }
  ]
})

const roleLabel = computed(() =>
  authStore.userInfo.role === 'admin' ? $t('page.list.role.admin') : $t('page.list.role.user')
)
</script>

<template>
  <div class="app-page dashboard">
    <section class="dashboard__hero app-card">
      <div class="dashboard__hero-left">
        <h2 class="dashboard__welcome">
          {{ $t('page.dashboard.welcome', { name: authStore.userInfo.userName }) }}
        </h2>
        <p class="dashboard__hint">{{ $t('page.dashboard.hint') }}</p>
      </div>
      <div class="dashboard__hero-right">
        <el-tag :type="authStore.userInfo.role === 'admin' ? 'success' : 'info'" round size="large">
          <SvgIcon icon="mdi:shield-account-outline" :size="14" />
          <span class="dashboard__role-text">{{ $t('page.dashboard.yourRole') }}：{{ roleLabel }}</span>
        </el-tag>
      </div>
    </section>

    <section class="dashboard__grid">
      <div
        v-for="item in stats"
        :key="item.key"
        class="dashboard__stat app-card"
        :class="`dashboard__stat--${item.tone}`"
      >
        <div class="dashboard__stat-icon">
          <SvgIcon :icon="item.icon" :size="22" />
        </div>
        <div class="dashboard__stat-body">
          <div class="dashboard__stat-label">
            {{ $t(`page.dashboard.${item.key}`) }}
          </div>
          <div class="dashboard__stat-value">{{ item.value }}</div>
        </div>
      </div>
    </section>

    <section class="dashboard__menu app-card">
      <header class="dashboard__menu-head">
        <SvgIcon icon="mdi:menu-open" :size="18" />
        <span>{{ $t('page.dashboard.visibleMenus') }}</span>
      </header>
      <div class="dashboard__menu-list">
        <div v-for="m in visibleMenus" :key="m.label" class="dashboard__menu-item">
          <SvgIcon :icon="m.icon" :size="18" />
          <span>{{ m.label }}</span>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped lang="scss">
.dashboard {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.dashboard__hero {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
}

.dashboard__welcome {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
}

.dashboard__hint {
  margin: 6px 0 0;
  color: var(--el-text-color-secondary);
  font-size: 13px;
}

.dashboard__role-text {
  margin-left: 6px;
}

.dashboard__grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 12px;
}

.dashboard__stat {
  display: flex;
  align-items: center;
  gap: 16px;
}

.dashboard__stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--stat-bg);
  color: var(--stat-fg);
}

.dashboard__stat--primary {
  --stat-bg: var(--el-color-primary-light-9);
  --stat-fg: var(--el-color-primary);
}

.dashboard__stat--success {
  --stat-bg: var(--el-color-success-light-9);
  --stat-fg: var(--el-color-success);
}

.dashboard__stat--warning {
  --stat-bg: var(--el-color-warning-light-9);
  --stat-fg: var(--el-color-warning);
}

.dashboard__stat--danger {
  --stat-bg: var(--el-color-danger-light-9);
  --stat-fg: var(--el-color-danger);
}

.dashboard__stat-label {
  font-size: 13px;
  color: var(--el-text-color-secondary);
  white-space: nowrap;
}

.dashboard__stat-value {
  margin-top: 4px;
  font-size: 22px;
  font-weight: 600;
  white-space: nowrap;
}

.dashboard__menu-head {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 500;
  margin-bottom: 12px;
}

.dashboard__menu-list {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.dashboard__menu-item {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 14px;
  background-color: var(--el-fill-color-light);
  border-radius: 20px;
  font-size: 13px;
}
</style>
