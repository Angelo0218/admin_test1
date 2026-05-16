<script setup lang="ts">
import { useAppStore } from '@/store'
import Breadcrumb from './Breadcrumb.vue'
import UserDropdown from './UserDropdown.vue'

const appStore = useAppStore()
</script>

<template>
  <header class="app-header">
    <div class="app-header__left">
      <el-button
        text
        class="collapse-btn"
        :aria-label="appStore.siderCollapsed ? $t('layout.expand') : $t('layout.collapse')"
        @click="appStore.toggleSider"
      >
        <SvgIcon
          :icon="appStore.siderCollapsed ? 'mdi:menu' : 'mdi:menu-open'"
          :size="20"
        />
      </el-button>
      <Breadcrumb />
    </div>

    <div class="app-header__right">
      <LangSwitch />
      <ThemeToggle />
      <FullScreen />
      <UserDropdown />
    </div>
  </header>
</template>

<style scoped lang="scss">
.app-header {
  height: var(--app-header-height);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 14px;
  background-color: var(--app-header-bg);
  border-bottom: 1px solid var(--app-header-border);
  position: sticky;
  top: 0;
  z-index: 5;
}

.app-header__left,
.app-header__right {
  display: flex;
  align-items: center;
  gap: 8px;
}

.collapse-btn {
  padding: 6px;
}
</style>
