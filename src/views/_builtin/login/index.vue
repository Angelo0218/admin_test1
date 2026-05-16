<script setup lang="ts">
import type { FormInstance, FormRules } from 'element-plus'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/store'
import { $t } from '@/locales'

const route = useRoute()
const authStore = useAuthStore()

const formRef = ref<FormInstance | null>(null)
const form = reactive({ username: '', password: '' })

const rules = computed<FormRules>(() => ({
  username: [{ required: true, message: $t('page.login.usernamePlaceholder'), trigger: 'blur' }],
  password: [{ required: true, message: $t('page.login.passwordPlaceholder'), trigger: 'blur' }]
}))

const redirectPath = computed(() => {
  const r = route.query.redirect
  return typeof r === 'string' ? r : '/'
})

async function onSubmit() {
  const valid = await formRef.value?.validate().catch(() => false)
  if (!valid) return
  await authStore.login(form.username.trim(), form.password, redirectPath.value)
}

function fillAccount(role: App.UserRole) {
  if (role === 'admin') {
    form.username = 'admin'
    form.password = 'admin123'
  } else {
    form.username = 'user'
    form.password = 'user123'
  }
}
</script>

<template>
  <div class="login-page">
    <div class="login-page__bg" />
    <div class="login-card">
      <div class="login-card__header">
        <SvgIcon icon="mdi:cube-outline" :size="40" color="var(--el-color-primary)" />
        <h1 class="login-card__title">{{ $t('page.login.title') }}</h1>
        <p class="login-card__subtitle">{{ $t('page.login.subtitle') }}</p>
      </div>

      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        size="large"
        label-position="top"
        class="login-card__form"
        @submit.prevent="onSubmit"
      >
        <el-form-item prop="username" :label="$t('page.login.username')">
          <el-input
            v-model="form.username"
            :placeholder="$t('page.login.usernamePlaceholder')"
            autocomplete="username"
          >
            <template #prefix>
              <SvgIcon icon="mdi:account-outline" :size="18" />
            </template>
          </el-input>
        </el-form-item>

        <el-form-item prop="password" :label="$t('page.login.password')">
          <el-input
            v-model="form.password"
            type="password"
            show-password
            :placeholder="$t('page.login.passwordPlaceholder')"
            autocomplete="current-password"
            @keyup.enter="onSubmit"
          >
            <template #prefix>
              <SvgIcon icon="mdi:lock-outline" :size="18" />
            </template>
          </el-input>
        </el-form-item>

        <el-button
          type="primary"
          size="large"
          class="login-card__submit"
          :loading="authStore.loginLoading"
          @click="onSubmit"
        >
          {{ authStore.loginLoading ? $t('page.login.submitting') : $t('page.login.submit') }}
        </el-button>
      </el-form>

      <div class="login-card__hint">
        <div class="login-card__hint-title">
          <SvgIcon icon="mdi:information-outline" :size="16" />
          <span>{{ $t('page.login.testAccounts') }}</span>
        </div>
        <div class="login-card__hint-row">
          <span>{{ $t('page.login.adminAccount') }}</span>
          <el-link type="primary" :underline="false" @click="fillAccount('admin')">
            {{ $t('common.apply') }}
          </el-link>
        </div>
        <div class="login-card__hint-row">
          <span>{{ $t('page.login.userAccount') }}</span>
          <el-link type="primary" :underline="false" @click="fillAccount('user')">
            {{ $t('common.apply') }}
          </el-link>
        </div>
      </div>

      <div class="login-card__toolbar">
        <LangSwitch />
        <ThemeToggle />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.login-page {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  overflow: hidden;
}

.login-page__bg {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(at 20% 30%, rgba(64, 158, 255, 0.18), transparent 60%),
    radial-gradient(at 80% 70%, rgba(103, 194, 58, 0.14), transparent 60%),
    linear-gradient(135deg, #eef2f7 0%, #e6ecf2 100%);
  z-index: 0;
}

html.dark .login-page__bg {
  background:
    radial-gradient(at 20% 30%, rgba(64, 158, 255, 0.16), transparent 60%),
    radial-gradient(at 80% 70%, rgba(103, 194, 58, 0.12), transparent 60%),
    linear-gradient(135deg, #141618 0%, #1d1f22 100%);
}

.login-card {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 420px;
  padding: 32px 32px 24px;
  background-color: var(--el-bg-color);
  border-radius: 12px;
  box-shadow:
    0 10px 30px rgba(0, 0, 0, 0.08),
    0 2px 6px rgba(0, 0, 0, 0.04);
}

.login-card__header {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  margin-bottom: 24px;
}

.login-card__title {
  margin: 12px 0 4px;
  font-size: 22px;
  font-weight: 600;
}

.login-card__subtitle {
  margin: 0;
  font-size: 13px;
  color: var(--el-text-color-secondary);
}

.login-card__form :deep(.el-form-item__label) {
  font-weight: 500;
  font-size: 13px;
}

.login-card__submit {
  width: 100%;
  margin-top: 4px;
}

.login-card__hint {
  margin-top: 20px;
  padding: 12px 14px;
  border: 1px dashed var(--el-border-color);
  border-radius: 8px;
  font-size: 12px;
  color: var(--el-text-color-secondary);

  .login-card__hint-title {
    display: flex;
    align-items: center;
    gap: 6px;
    margin-bottom: 6px;
    color: var(--el-text-color-primary);
    font-weight: 500;
  }

  .login-card__hint-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    line-height: 1.8;
  }
}

.login-card__toolbar {
  margin-top: 18px;
  display: flex;
  justify-content: center;
  gap: 8px;
}
</style>
