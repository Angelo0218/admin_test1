<script setup lang="ts">
import { ElMessage } from 'element-plus'
import { fetchAuditLogList } from '@/api/audit-log'
import { $t } from '@/locales'
import LogDetail from './LogDetail.vue'

const ACTIONS: Api.AuditLog.Action[] = [
  'login',
  'logout',
  'create_role',
  'update_role',
  'delete_role',
  'view_list',
  'export'
]

interface Filter {
  action: Api.AuditLog.Action | ''
  operator: string
  status: Api.AuditLog.Status | ''
  dateRange: [string, string] | null
}

const filter = reactive<Filter>({
  action: '',
  operator: '',
  status: '',
  dateRange: null
})

const page = ref(1)
const pageSize = ref(10)
const total = ref(0)
const loading = ref(false)
const rows = ref<Api.AuditLog.Row[]>([])

const drawerVisible = ref(false)
const detailId = ref<number | null>(null)

const actionOptions = computed(() =>
  ACTIONS.map((a) => ({ value: a, label: $t(`page.auditLog.action.${a}`) }))
)

const statusOptions = computed(() => [
  { value: 'success' as const, label: $t('page.auditLog.status.success') },
  { value: 'failed' as const, label: $t('page.auditLog.status.failed') }
])

async function load() {
  loading.value = true
  try {
    const data = await fetchAuditLogList({
      page: page.value,
      pageSize: pageSize.value,
      action: filter.action || undefined,
      operator: filter.operator.trim() || undefined,
      status: filter.status || undefined,
      dateFrom: filter.dateRange?.[0] || undefined,
      dateTo: filter.dateRange?.[1] || undefined
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
  filter.action = ''
  filter.operator = ''
  filter.status = ''
  filter.dateRange = null
  page.value = 1
  load()
}

function onOpenDetail(row: Api.AuditLog.Row) {
  detailId.value = row.id
  drawerVisible.value = true
}

watch([page, pageSize], load)
onMounted(load)
</script>

<template>
  <div class="app-page audit-page">
    <section class="audit-page__filter app-card">
      <el-form :inline="true" @submit.prevent="onSearch">
        <el-form-item :label="$t('page.auditLog.filter.action')">
          <el-select
            v-model="filter.action"
            :placeholder="$t('page.auditLog.filter.actionPlaceholder')"
            clearable
            class="audit-page__select"
          >
            <el-option
              v-for="opt in actionOptions"
              :key="opt.value"
              :label="opt.label"
              :value="opt.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('page.auditLog.filter.operator')">
          <el-input
            v-model="filter.operator"
            :placeholder="$t('page.auditLog.filter.operatorPlaceholder')"
            clearable
            class="audit-page__input"
            @keyup.enter="onSearch"
          />
        </el-form-item>
        <el-form-item :label="$t('page.auditLog.filter.status')">
          <el-select
            v-model="filter.status"
            :placeholder="$t('page.auditLog.filter.statusPlaceholder')"
            clearable
            class="audit-page__select-sm"
          >
            <el-option
              v-for="opt in statusOptions"
              :key="opt.value"
              :label="opt.label"
              :value="opt.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('page.auditLog.filter.dateRange')">
          <el-date-picker
            v-model="filter.dateRange"
            type="daterange"
            value-format="YYYY-MM-DD"
            :start-placeholder="$t('page.auditLog.filter.dateStart')"
            :end-placeholder="$t('page.auditLog.filter.dateEnd')"
            class="audit-page__date"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="audit-page__filter-btn" @click="onSearch">
            <SvgIcon icon="mdi:magnify" :size="16" />
            <span class="audit-page__btn-label">{{ $t('common.search') }}</span>
          </el-button>
          <el-button class="audit-page__filter-btn" @click="onReset">
            <SvgIcon icon="mdi:refresh" :size="16" />
            <span class="audit-page__btn-label">{{ $t('common.reset') }}</span>
          </el-button>
        </el-form-item>
      </el-form>
    </section>

    <section class="audit-page__table app-card">
      <div class="audit-page__table-head">
        <div class="audit-page__title-group">
          <h3 class="audit-page__title">{{ $t('page.auditLog.title') }}</h3>
          <span class="audit-page__subtitle">{{ $t('page.auditLog.subtitle') }}</span>
        </div>
        <el-button text @click="load">
          <SvgIcon icon="mdi:refresh" :size="16" />
          <span class="audit-page__btn-label">{{ $t('common.refresh') }}</span>
        </el-button>
      </div>

      <el-table v-loading="loading" :data="rows" stripe size="small" class="audit-page__el-table">
        <el-table-column prop="id" :label="$t('page.auditLog.column.id')" width="80" align="center" />
        <el-table-column prop="createdAt" :label="$t('page.auditLog.column.createdAt')" width="170" />
        <el-table-column :label="$t('page.auditLog.column.operator')" width="160">
          <template #default="{ row }: { row: Api.AuditLog.Row }">
            <span class="audit-page__operator">{{ row.operator }}</span>
            <el-tag :type="row.operatorRole === 'admin' ? 'success' : 'info'" size="small" effect="plain">
              {{ row.operatorRole === 'admin' ? $t('page.list.role.admin') : $t('page.list.role.user') }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column :label="$t('page.auditLog.column.action')" width="140">
          <template #default="{ row }: { row: Api.AuditLog.Row }">
            {{ $t(`page.auditLog.action.${row.action}`) }}
          </template>
        </el-table-column>
        <el-table-column
          prop="target"
          :label="$t('page.auditLog.column.target')"
          min-width="180"
          show-overflow-tooltip
        >
          <template #default="{ row }: { row: Api.AuditLog.Row }">
            <code class="audit-page__target">{{ row.target }}</code>
          </template>
        </el-table-column>
        <el-table-column prop="ip" :label="$t('page.auditLog.column.ip')" width="140" />
        <el-table-column :label="$t('page.auditLog.column.status')" width="100">
          <template #default="{ row }: { row: Api.AuditLog.Row }">
            <el-tag :type="row.status === 'success' ? 'success' : 'danger'" size="small" effect="light">
              {{ $t(`page.auditLog.status.${row.status}`) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column :label="$t('page.auditLog.column.actions')" width="90" align="center">
          <template #default="{ row }: { row: Api.AuditLog.Row }">
            <el-button
              text
              type="primary"
              class="audit-page__action-btn"
              :aria-label="$t('common.detail')"
              @click="onOpenDetail(row)"
            >
              <SvgIcon icon="mdi:eye-outline" :size="16" />
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="audit-page__pagination">
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

    <LogDetail v-model="drawerVisible" :id="detailId" />
  </div>
</template>

<style scoped lang="scss">
.audit-page {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.audit-page :deep(.el-form--inline .el-form-item) {
  margin-right: 12px;
  margin-bottom: 0;
}

.audit-page__select {
  width: 160px;
}

.audit-page__select-sm {
  width: 120px;
}

.audit-page__input {
  width: 180px;
}

.audit-page__date {
  width: 260px;
}

.audit-page__table-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 10px;
  gap: 12px;
  flex-wrap: wrap;
}

.audit-page__title-group {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.audit-page__title {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
}

.audit-page__subtitle {
  font-size: 12px;
  color: var(--el-text-color-secondary);
}

.audit-page__el-table {
  width: 100%;
}

.audit-page__operator {
  margin-right: 6px;
}

.audit-page__target {
  font-family: 'JetBrains Mono', Menlo, Consolas, monospace;
  font-size: 12px;
  padding: 2px 6px;
  background-color: var(--el-fill-color-light);
  border-radius: 4px;
}

.audit-page__btn-label {
  margin-left: 4px;
}

.audit-page__pagination {
  margin-top: 12px;
  display: flex;
  justify-content: flex-end;
}

.audit-page__action-btn {
  min-width: 0 !important;
  min-height: 0;
  padding: 4px 6px;
  margin: 0;
}

.audit-page__filter-btn {
  min-width: 96px !important;
  justify-content: center;
}
</style>
