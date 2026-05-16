<script setup lang="ts">
import { Icon } from '@iconify/vue'

interface Props {
  icon: string
  size?: number | string
  color?: string
}

const props = withDefaults(defineProps<Props>(), {
  size: 18
})

const sizeStr = computed(() => (typeof props.size === 'number' ? `${props.size}px` : props.size))
</script>

<template>
  <Icon :icon="icon" :width="sizeStr" :height="sizeStr" :color="color" aria-hidden="true" />
</template>
