<script setup lang="ts">
import { useAppStore } from '@/store'
import Sider from './modules/Sider.vue'
import Header from './modules/Header.vue'

const appStore = useAppStore()
</script>

<template>
  <div class="base-layout">
    <Sider :collapsed="appStore.siderCollapsed" />
    <div class="base-layout__main" :class="{ 'is-collapsed': appStore.siderCollapsed }">
      <Header />
      <main class="base-layout__content">
        <router-view v-slot="{ Component, route }">
          <transition name="fade" mode="out-in">
            <component :is="Component" :key="route.fullPath" />
          </transition>
        </router-view>
      </main>
    </div>
  </div>
</template>

<style scoped lang="scss">
.base-layout {
  display: flex;
  height: 100vh;
  background-color: var(--app-bg-color);
}

.base-layout__main {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
  margin-left: var(--app-sider-width);
  transition: margin-left 0.25s ease;

  &.is-collapsed {
    margin-left: var(--app-sider-width-collapsed);
  }
}

.base-layout__content {
  flex: 1;
  overflow: auto;
  background-color: var(--app-bg-color);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
