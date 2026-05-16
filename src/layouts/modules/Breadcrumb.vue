<script setup lang="ts">
import { useRoute } from 'vue-router'

const route = useRoute()

const items = computed(() => {
  return route.matched
    .filter((m) => m.meta?.title && !m.meta?.constant)
    .map((m) => ({
      path: m.path,
      title: m.meta!.title as string
    }))
})
</script>

<template>
  <el-breadcrumb separator="/" class="breadcrumb">
    <el-breadcrumb-item v-for="item in items" :key="item.path" :to="item.path">
      {{ $t(item.title) }}
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>

<style scoped lang="scss">
.breadcrumb {
  font-size: 14px;
}
</style>
