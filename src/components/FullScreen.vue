<script setup lang="ts">
const isFullscreen = ref(false)

function update() {
  isFullscreen.value = Boolean(document.fullscreenElement)
}

function toggle() {
  if (document.fullscreenElement) {
    document.exitFullscreen().catch(() => undefined)
  } else {
    document.documentElement.requestFullscreen().catch(() => undefined)
  }
}

onMounted(() => document.addEventListener('fullscreenchange', update))
onBeforeUnmount(() => document.removeEventListener('fullscreenchange', update))
</script>

<template>
  <el-tooltip
    :content="isFullscreen ? $t('layout.exitFullScreen') : $t('layout.fullScreen')"
    placement="bottom"
  >
    <el-button circle plain :aria-label="$t('layout.fullScreen')" @click="toggle">
      <SvgIcon :icon="isFullscreen ? 'mdi:fullscreen-exit' : 'mdi:fullscreen'" :size="18" />
    </el-button>
  </el-tooltip>
</template>
