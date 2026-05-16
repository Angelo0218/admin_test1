<script setup lang="ts">
import { useRouter } from 'vue-router'
const router = useRouter()
</script>

<template>
  <div class="error-page">
    <SvgIcon icon="mdi:map-search-outline" :size="84" color="#909399" />
    <h1 class="error-page__title">{{ $t('page.error.e404Title') }}</h1>
    <p class="error-page__desc">{{ $t('page.error.e404Desc') }}</p>
    <el-button type="primary" @click="router.replace('/')">
      {{ $t('page.error.backHome') }}
    </el-button>
  </div>
</template>

<style scoped lang="scss">
.error-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  text-align: center;
  padding: 24px;
  gap: 12px;
  background-color: var(--app-bg-color);
}

.error-page__title {
  margin: 8px 0 0;
  font-size: 22px;
  font-weight: 600;
}

.error-page__desc {
  margin: 0 0 12px;
  color: var(--el-text-color-secondary);
}
</style>
