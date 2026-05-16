<script setup lang="ts">
import { ElMessage, ElMessageBox } from 'element-plus'
import { deleteRole, fetchRoleList } from '@/api/role'
import { $t } from '@/locales'
import { parseApiError } from '@/utils/error'
import RoleForm from './RoleForm.vue'

const keyword = ref('')
const page = ref(1)
const pageSize = ref(10)
const total = ref(0)
const loading = ref(false)
const rows = ref<Api.Role.Row[]>([])

const dialogVisible = ref(false)
const editing = ref<Api.Role.Row | null>(null)

async function load() {
  loading.value = true
  try {
    const data = await fetchRoleList({
      page: page.value,
      pageSize: pageSize.value,
      keyword: keyword.value.trim() || undefined
    })
    rows.value = data.list
    total.value = data.total
  } catch (err) {
    ElMessage.error((err as Error).message)
  } finally {
    loading.value = false
  }
}

function onSearch() {
  page.value = 1
  load()
}

function onReset() {
  keyword.value = ''
  page.value = 1
  load()
}

function onAdd() {
  editing.value = null
  dialogVisible.value = true
}

function onEdit(row: Api.Role.Row) {
  editing.value = row
  dialogVisible.value = true
}

async function onDelete(row: Api.Role.Row) {
  if (row.builtin) {
    ElMessage.warning($t('page.roleMgmt.deleteBuiltinError', { name: row.name }))
    return
  }
  try {
    await ElMessageBox.confirm(
      $t('page.roleMgmt.deleteConfirm', { name: row.name }),
      $t('common.delete'),
      {
        confirmButtonText: $t('common.confirm'),
        cancelButtonText: $t('common.cancel'),
        type: 'warning'
      }
    )
  } catch {
    return
  }
  try {
    await deleteRole(row.id)
    ElMessage.success($t('page.roleMgmt.deleteSuccess', { name: row.name }))
    if (rows.value.length === 1 && page.value > 1) page.value -= 1
    await load()
  } catch (err) {
    const parsed = parseApiError(err)
    if (parsed.code === 'BUILTIN_NOT_DELETABLE') {
      ElMessage.warning($t('page.roleMgmt.deleteBuiltinError', { name: row.name }))
    } else {
      ElMessage.error(parsed.message)
    }
  }
}

function onSaved() {
  load()
}

watch([page, pageSize], load)
onMounted(load)
</script>

<template>
  <div class="app-page role-page">
    <section class="role-page__filter app-card">
      <el-form :inline="true" label-width="80px" @submit.prevent="onSearch">
        <el-form-item :label="$t('page.roleMgmt.keyword')">
          <el-input
            v-model="keyword"
            :placeholder="$t('page.roleMgmt.keywordPlaceholder')"
            clearable
            class="role-page__keyword"
            @keyup.enter="onSearch"
          >
            <template #prefix>
              <SvgIcon icon="mdi:magnify" :size="16" />
            </template>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="role-page__filter-btn" @click="onSearch">
            <SvgIcon icon="mdi:magnify" :size="16" />
            <span class="role-page__btn-label">{{ $t('common.search') }}</span>
          </el-button>
          <el-button class="role-page__filter-btn" @click="onReset">
            <SvgIcon icon="mdi:refresh" :size="16" />
            <span class="role-page__btn-label">{{ $t('common.reset') }}</span>
          </el-button>
        </el-form-item>
      </el-form>
    </section>

    <section class="role-page__table app-card">
      <div class="role-page__table-head">
        <div class="role-page__title-group">
          <h3 class="role-page__title">{{ $t('page.roleMgmt.title') }}</h3>
          <span class="role-page__subtitle">{{ $t('page.roleMgmt.subtitle') }}</span>
        </div>
        <div class="role-page__head-actions">
          <el-button type="primary" @click="onAdd">
            <SvgIcon icon="mdi:plus" :size="16" />
            <span class="role-page__btn-label">{{ $t('page.roleMgmt.addRole') }}</span>
          </el-button>
          <el-button text @click="load">
            <SvgIcon icon="mdi:refresh" :size="16" />
            <span class="role-page__btn-label">{{ $t('common.refresh') }}</span>
          </el-button>
        </div>
      </div>

      <el-table v-loading="loading" :data="rows" stripe size="small" class="role-page__el-table">
        <el-table-column prop="id" :label="$t('page.roleMgmt.column.id')" width="80" align="center" />
        <el-table-column prop="code" :label="$t('page.roleMgmt.column.code')" width="140">
          <template #default="{ row }: { row: Api.Role.Row }">
            <code class="role-page__code">{{ row.code }}</code>
          </template>
        </el-table-column>
        <el-table-column prop="name" :label="$t('page.roleMgmt.column.name')" width="160">
          <template #default="{ row }: { row: Api.Role.Row }">
            <span>{{ row.name }}</span>
            <el-tag v-if="row.builtin" type="info" size="small" effect="plain" class="role-page__builtin">
              {{ $t('page.roleMgmt.column.builtin') }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="description"
          :label="$t('page.roleMgmt.column.description')"
          min-width="220"
          show-overflow-tooltip
        />
        <el-table-column :label="$t('page.roleMgmt.column.userCount')" width="100" align="center">
          <template #default="{ row }: { row: Api.Role.Row }">
            <el-tag type="info" size="small" effect="plain">{{ row.userCount }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column :label="$t('page.roleMgmt.column.status')" width="100">
          <template #default="{ row }: { row: Api.Role.Row }">
            <el-tag :type="row.enabled ? 'success' : 'danger'" effect="light" size="small">
              {{ row.enabled ? $t('page.roleMgmt.status.enabled') : $t('page.roleMgmt.status.disabled') }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" :label="$t('page.roleMgmt.column.createdAt')" width="180" />
        <el-table-column :label="$t('page.roleMgmt.column.action')" width="120" align="center">
          <template #default="{ row }: { row: Api.Role.Row }">
            <div class="role-page__actions">
              <el-button
                text
                type="primary"
                class="role-page__action-btn"
                :aria-label="$t('common.edit')"
                @click="onEdit(row)"
              >
                <SvgIcon icon="mdi:pencil-outline" :size="16" />
              </el-button>
              <el-button
                text
                type="danger"
                class="role-page__action-btn"
                :disabled="row.builtin"
                :aria-label="$t('common.delete')"
                @click="onDelete(row)"
              >
                <SvgIcon icon="mdi:trash-can-outline" :size="16" />
              </el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>

      <div class="role-page__pagination">
        <el-pagination
          v-model:current-page="page"
          v-model:page-size="pageSize"
          :total="total"
          :page-sizes="[10, 20, 30, 50]"
          background
          layout="total, sizes, prev, pager, next, jumper"
        />
      </div>
    </section>

    <RoleForm v-model="dialogVisible" :role="editing" @saved="onSaved" />
  </div>
</template>

<style scoped lang="scss">
.role-page {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.role-page :deep(.el-form--inline .el-form-item) {
  margin-right: 12px;
  margin-bottom: 0;
}

.role-page__keyword {
  width: 240px;
}

.role-page__table-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 10px;
  gap: 12px;
  flex-wrap: wrap;
}

.role-page__title-group {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.role-page__title {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
}

.role-page__subtitle {
  font-size: 12px;
  color: var(--el-text-color-secondary);
}

.role-page__head-actions {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.role-page__el-table {
  width: 100%;
}

.role-page__btn-label {
  margin-left: 4px;
}

.role-page__pagination {
  margin-top: 12px;
  display: flex;
  justify-content: flex-end;
}

.role-page__actions {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.role-page__action-btn {
  min-width: 0 !important;
  min-height: 0;
  padding: 4px 6px;
  margin: 0;
}

.role-page__filter-btn {
  min-width: 96px !important;
  justify-content: center;
}

.role-page__code {
  font-family: 'JetBrains Mono', 'Fira Code', Menlo, Consolas, monospace;
  font-size: 12px;
  padding: 2px 6px;
  background-color: var(--el-fill-color-light);
  border-radius: 4px;
}

.role-page__builtin {
  margin-left: 6px;
}
</style>
