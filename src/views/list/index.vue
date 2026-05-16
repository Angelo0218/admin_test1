<script setup lang="ts">
import { ElMessage } from 'element-plus'
import { fetchListData } from '@/api/list'

const keyword = ref('')
const page = ref(1)
const pageSize = ref(10)
const total = ref(0)
const loading = ref(false)
const rows = ref<Api.List.Row[]>([])

async function load() {
  loading.value = true
  try {
    const data = await fetchListData({
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

watch([page, pageSize], load)

onMounted(load)
</script>

<template>
  <div class="app-page list-page">
    <section class="list-page__filter app-card">
      <el-form :inline="true" label-width="80px" @submit.prevent="onSearch">
        <el-form-item :label="$t('page.list.keyword')">
          <el-input
            v-model="keyword"
            :placeholder="$t('page.list.keywordPlaceholder')"
            clearable
            class="list-page__keyword"
            @keyup.enter="onSearch"
          >
            <template #prefix>
              <SvgIcon icon="mdi:magnify" :size="16" />
            </template>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="list-page__filter-btn" @click="onSearch">
            <SvgIcon icon="mdi:magnify" :size="16" />
            <span class="list-page__btn-label">{{ $t('common.search') }}</span>
          </el-button>
          <el-button class="list-page__filter-btn" @click="onReset">
            <SvgIcon icon="mdi:refresh" :size="16" />
            <span class="list-page__btn-label">{{ $t('common.reset') }}</span>
          </el-button>
        </el-form-item>
      </el-form>
    </section>

    <section class="list-page__table app-card">
      <div class="list-page__table-head">
        <h3 class="list-page__title">{{ $t('page.list.title') }}</h3>
        <el-button text @click="load">
          <SvgIcon icon="mdi:refresh" :size="16" />
          <span class="list-page__btn-label">{{ $t('common.refresh') }}</span>
        </el-button>
      </div>

      <el-table v-loading="loading" :data="rows" stripe size="small" class="list-page__el-table">
        <el-table-column prop="id" :label="$t('page.list.column.id')" width="80" align="center" />
        <el-table-column prop="name" :label="$t('page.list.column.name')" min-width="140" />
        <el-table-column :label="$t('page.list.column.role')" width="140">
          <template #default="{ row }: { row: Api.List.Row }">
            <el-tag :type="row.role === 'admin' ? 'success' : 'info'" size="small">
              {{ row.role === 'admin' ? $t('page.list.role.admin') : $t('page.list.role.user') }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="email" :label="$t('page.list.column.email')" min-width="220" />
        <el-table-column :label="$t('page.list.column.status')" width="120">
          <template #default="{ row }: { row: Api.List.Row }">
            <el-tag :type="row.status === 'active' ? 'success' : 'danger'" effect="light" size="small">
              {{ row.status === 'active' ? $t('page.list.status.active') : $t('page.list.status.inactive') }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" :label="$t('page.list.column.createdAt')" width="180" />
        <el-table-column :label="$t('page.list.column.action')" width="120" align="center">
          <template #default>
            <div class="list-page__actions">
              <el-button
                text
                type="primary"
                class="list-page__action-btn"
                :aria-label="$t('common.view')"
              >
                <SvgIcon icon="mdi:eye-outline" :size="16" />
              </el-button>
              <el-button
                text
                type="primary"
                class="list-page__action-btn"
                :aria-label="$t('common.edit')"
              >
                <SvgIcon icon="mdi:pencil-outline" :size="16" />
              </el-button>
              <el-button
                text
                type="danger"
                class="list-page__action-btn"
                :aria-label="$t('common.delete')"
              >
                <SvgIcon icon="mdi:trash-can-outline" :size="16" />
              </el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>

      <div class="list-page__pagination">
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
  </div>
</template>

<style scoped lang="scss">
.list-page {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.list-page :deep(.el-form--inline .el-form-item) {
  margin-right: 12px;
  margin-bottom: 0;
}

.list-page__keyword {
  width: 240px;
}

.list-page__table-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}

.list-page__title {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
}

.list-page__el-table {
  width: 100%;
}

.list-page__btn-label {
  margin-left: 4px;
}

.list-page__pagination {
  margin-top: 12px;
  display: flex;
  justify-content: flex-end;
}

.list-page__actions {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.list-page__action-btn {
  min-width: 0 !important;
  min-height: 0;
  padding: 4px 6px;
  margin: 0;
}

.list-page__action-btn + .list-page__action-btn {
  margin-left: 0;
}

.list-page__filter-btn {
  min-width: 96px !important;
  justify-content: center;
}
</style>
