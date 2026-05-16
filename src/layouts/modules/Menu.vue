<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/store'

interface Props {
  collapsed?: boolean
}
const props = defineProps<Props>()

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const menuItems = computed(() => {
  const root = router.options.routes.find((r) => r.path === '/')
  if (!root || !root.children) return []
  return root.children
    .filter((r) => !r.meta?.hideInMenu)
    .filter((r) => {
      const required = r.meta?.roles
      if (!required || required.length === 0) return true
      return required.includes(authStore.userInfo.role)
    })
    .map((r) => ({
      index: `/${r.path.replace(/^\//, '')}`,
      title: r.meta?.title ?? r.path,
      icon: r.meta?.icon ?? 'mdi:circle-small'
    }))
})

const activeIndex = computed(() => route.path)

const menuClass = computed(() => ['sider-menu', { 'sider-menu--collapsed': props.collapsed }])

function onSelect(index: string) {
  if (index !== route.path) router.push(index)
}
</script>

<template>
  <el-menu
    :default-active="activeIndex"
    :collapse="false"
    :collapse-transition="false"
    background-color="transparent"
    text-color="var(--app-sider-text-color)"
    active-text-color="var(--app-sider-active-text)"
    :class="menuClass"
    @select="onSelect"
  >
    <el-menu-item v-for="item in menuItems" :key="item.index" :index="item.index">
      <el-icon class="sider-menu__icon">
        <SvgIcon :icon="item.icon" :size="20" />
      </el-icon>
      <template #title>
        <span class="sider-menu__title">{{ $t(item.title) }}</span>
      </template>
    </el-menu-item>
  </el-menu>
</template>

<style scoped lang="scss">
/* Whole menu always fills sider width — no Element Plus jump from full to 64px */
.sider-menu {
  width: 100% !important;
  border-right: 0;
  background: transparent;
  overflow: hidden;
}

/* Menu items: CONSTANT dimensions, padding, margin across collapsed / expanded.
   Symmetric padding (12px each side) so icon sits at geometric centre in collapsed state.
   overflow:hidden clips the title text that overflows when sider narrows. */
.sider-menu :deep(.el-menu-item) {
  height: 44px;
  line-height: 44px;
  margin: 2px 8px !important;
  padding: 0 12px !important;
  border-radius: 6px;
  overflow: hidden;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: var(--app-sider-active-bg) !important;
    color: var(--app-sider-active-text) !important;
  }

  &.is-active {
    background-color: var(--el-color-primary) !important;
    color: #fff !important;
  }
}

/* Icon: CONSTANT size + margin + position across both states */
.sider-menu :deep(.el-menu-item .el-icon) {
  font-size: 20px !important;
  width: 20px !important;
  height: 20px !important;
  margin-right: 10px;
  margin-left: 0;
  flex-shrink: 0;
}

/* Title: fades opacity only, does NOT change width or position.
   flex-shrink: 0 prevents flex layout from squeezing it. Overflow gets clipped by menu-item. */
.sider-menu :deep(.el-menu-item > span) {
  display: inline-block;
  white-space: nowrap;
  flex-shrink: 0;
  opacity: 1;
  transition: opacity 0.2s ease;
}

.sider-menu--collapsed :deep(.el-menu-item > span) {
  opacity: 0;
}
</style>
