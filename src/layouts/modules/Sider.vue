<script setup lang="ts">
import Logo from './Logo.vue'
import Menu from './Menu.vue'

interface Props {
  collapsed?: boolean
}
defineProps<Props>()
</script>

<template>
  <aside class="sider" :class="{ 'is-collapsed': collapsed }">
    <Logo :collapsed="collapsed" />
    <div class="sider__menu-wrap">
      <Menu :collapsed="collapsed" />
    </div>
  </aside>
</template>

<style scoped lang="scss">
.sider {
  position: fixed;
  inset: 0 auto 0 0;
  width: var(--app-sider-width);
  background-color: var(--app-sider-bg-color);
  display: flex;
  flex-direction: column;
  transition: width 0.25s ease;
  z-index: 10;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.06);

  &.is-collapsed {
    width: var(--app-sider-width-collapsed);
  }
}

.sider__menu-wrap {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 8px 0;
}
</style>
