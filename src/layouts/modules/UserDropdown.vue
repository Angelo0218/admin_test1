<script setup lang="ts">
import { ElMessageBox } from 'element-plus'
import { useAuthStore } from '@/store'
import { $t } from '@/locales'

const authStore = useAuthStore()

const roleLabel = computed(() =>
  authStore.userInfo.role === 'admin' ? $t('page.list.role.admin') : $t('page.list.role.user')
)

async function onCommand(cmd: string) {
  if (cmd === 'logout') {
    try {
      await ElMessageBox.confirm($t('common.logoutConfirm'), $t('common.logout'), {
        confirmButtonText: $t('common.confirm'),
        cancelButtonText: $t('common.cancel'),
        type: 'warning'
      })
      await authStore.resetStore()
    } catch {
      /* user cancelled */
    }
  }
}
</script>

<template>
  <el-dropdown trigger="hover" placement="bottom-end" @command="onCommand">
    <div class="user-dropdown">
      <el-avatar :size="32" class="user-dropdown__avatar">
        <SvgIcon icon="mdi:account" :size="20" />
      </el-avatar>
      <div class="user-dropdown__info">
        <span class="user-dropdown__name">{{ authStore.userInfo.userName || '—' }}</span>
        <span class="user-dropdown__role">{{ roleLabel }}</span>
      </div>
    </div>

    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item disabled>
          <span class="user-meta">
            <SvgIcon icon="mdi:account-circle-outline" :size="16" />
            {{ authStore.userInfo.userName }}
          </span>
        </el-dropdown-item>
        <el-dropdown-item disabled>
          <span class="user-meta">
            <SvgIcon icon="mdi:shield-account-outline" :size="16" />
            {{ roleLabel }}
          </span>
        </el-dropdown-item>
        <el-dropdown-item divided command="logout">
          <span class="user-meta">
            <SvgIcon icon="mdi:logout" :size="16" />
            {{ $t('common.logout') }}
          </span>
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<style scoped lang="scss">
.user-dropdown {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 4px 8px;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: var(--el-fill-color-light);
  }
}

.user-dropdown__avatar {
  background-color: var(--el-color-primary-light-7);
  color: var(--el-color-primary);
}

.user-dropdown__info {
  display: flex;
  flex-direction: column;
  line-height: 1.2;
  width: 72px;
}

.user-dropdown__name,
.user-dropdown__role {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.user-dropdown__name {
  font-size: 14px;
  font-weight: 500;
}

.user-dropdown__role {
  font-size: 12px;
  color: var(--el-text-color-secondary);
}

.user-meta {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}
</style>
