<script setup lang="ts">
interface Props {
  collapsed?: boolean
}
defineProps<Props>()
</script>

<template>
  <div class="logo">
    <div class="logo__icon">
      <SvgIcon icon="mdi:cube-outline" :size="28" color="var(--el-color-primary)" />
    </div>
    <transition name="logo-text">
      <span v-show="!collapsed" class="logo__text">{{ $t('common.brand') }}</span>
    </transition>
  </div>
</template>

<style scoped lang="scss">
.logo {
  display: flex;
  align-items: center;
  height: var(--app-header-height);
  color: #fff;
  font-weight: 600;
  font-size: 17px;
  letter-spacing: 1px;
  overflow: hidden;
}

.logo__icon {
  width: var(--app-sider-width-collapsed);
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo__text {
  white-space: nowrap;
}

.logo-text-enter-active,
.logo-text-leave-active {
  transition:
    opacity 0.15s ease,
    transform 0.15s ease;
}

.logo-text-enter-from,
.logo-text-leave-to {
  opacity: 0;
  transform: translateX(-6px);
}
</style>
