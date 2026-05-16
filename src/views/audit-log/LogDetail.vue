<script setup lang="ts">
import { ElMessage } from 'element-plus'
import { fetchAuditLogDetail } from '@/api/audit-log'
import { $t } from '@/locales'

interface Props {
  modelValue: boolean
  id: number | null
}

const props = defineProps<Props>()
const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const visible = computed({
  get: () => props.modelValue,
  set: (v) => emit('update:modelValue', v)
})

const loading = ref(false)
const detail = ref<Api.AuditLog.Detail | null>(null)

const roleLabel = computed(() =>
  detail.value?.operatorRole === 'admin'
    ? $t('page.list.role.admin')
    : $t('page.list.role.user')
)

const statusType = computed<'success' | 'danger'>(() =>
  detail.value?.status === 'success' ? 'success' : 'danger'
)

const requestText = computed(() => {
  const payload = detail.value?.requestPayload
  if (!payload) return $t('page.auditLog.detail.emptyRequest')
  return JSON.stringify(payload, null, 2)
})

const responseText = computed(() => {
  const raw = detail.value?.responseSnippet ?? ''
  if (!raw) return ''
  try {
    return JSON.stringify(JSON.parse(raw), null, 2)
  } catch {
    return raw
  }
})

async function load(id: number) {
  loading.value = true
  detail.value = null
  try {
    detail.value = await fetchAuditLogDetail(id)
  } catch {
    ElMessage.error($t('page.auditLog.detailError'))
    visible.value = false
  } finally {
    loading.value = false
  }
}

watch(
  () => [props.modelValue, props.id] as const,
  ([open, id]) => {
    if (open && typeof id === 'number') load(id)
  },
  { immediate: true }
)
</script>

<template>
  <el-drawer v-model="visible" size="520px" :title="$t('page.auditLog.detail.title')" destroy-on-close>
    <div v-loading="loading" class="log-detail">
      <template v-if="detail">
        <dl class="log-detail__list">
          <dt>{{ $t('page.auditLog.column.id') }}</dt>
          <dd>#{{ detail.id }}</dd>

          <dt>{{ $t('page.auditLog.column.createdAt') }}</dt>
          <dd>{{ detail.createdAt }}</dd>

          <dt>{{ $t('page.auditLog.column.operator') }}</dt>
          <dd>
            {{ detail.operator }}
            <el-tag :type="detail.operatorRole === 'admin' ? 'success' : 'info'" size="small" effect="plain">
              {{ roleLabel }}
            </el-tag>
          </dd>

          <dt>{{ $t('page.auditLog.column.action') }}</dt>
          <dd>{{ $t(`page.auditLog.action.${detail.action}`) }}</dd>

          <dt>{{ $t('page.auditLog.column.target') }}</dt>
          <dd>
            <code class="log-detail__code">{{ detail.target }}</code>
          </dd>

          <dt>{{ $t('page.auditLog.column.status') }}</dt>
          <dd>
            <el-tag :type="statusType" size="small" effect="light">
              {{ $t(`page.auditLog.status.${detail.status}`) }}
            </el-tag>
          </dd>

          <dt>{{ $t('page.auditLog.detail.duration') }}</dt>
          <dd>{{ detail.durationMs }} {{ $t('page.auditLog.detail.durationUnit') }}</dd>

          <dt>{{ $t('page.auditLog.column.ip') }}</dt>
          <dd>
            <code class="log-detail__code">{{ detail.ip }}</code>
          </dd>

          <dt>{{ $t('page.auditLog.detail.userAgent') }}</dt>
          <dd class="log-detail__ua">{{ detail.userAgent }}</dd>
        </dl>

        <section class="log-detail__section">
          <header class="log-detail__section-title">
            <SvgIcon icon="mdi:arrow-up-bold-outline" :size="14" />
            {{ $t('page.auditLog.detail.request') }}
          </header>
          <pre class="log-detail__pre">{{ requestText }}</pre>
        </section>

        <section v-if="responseText" class="log-detail__section">
          <header class="log-detail__section-title">
            <SvgIcon icon="mdi:arrow-down-bold-outline" :size="14" />
            {{ $t('page.auditLog.detail.response') }}
          </header>
          <pre class="log-detail__pre">{{ responseText }}</pre>
        </section>
      </template>
    </div>
  </el-drawer>
</template>

<style scoped lang="scss">
.log-detail {
  min-height: 200px;
}

.log-detail__list {
  display: grid;
  grid-template-columns: 110px 1fr;
  gap: 8px 12px;
  margin: 0 0 18px;
}

.log-detail__list dt {
  color: var(--el-text-color-secondary);
  font-size: 12px;
  align-self: center;
}

.log-detail__list dd {
  margin: 0;
  font-size: 13px;
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.log-detail__ua {
  font-family: 'JetBrains Mono', Menlo, Consolas, monospace;
  font-size: 11px;
  color: var(--el-text-color-secondary);
  word-break: break-all;
}

.log-detail__code {
  font-family: 'JetBrains Mono', Menlo, Consolas, monospace;
  font-size: 12px;
  padding: 2px 6px;
  background-color: var(--el-fill-color-light);
  border-radius: 4px;
}

.log-detail__section {
  margin-bottom: 16px;
}

.log-detail__section-title {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  font-weight: 500;
  margin-bottom: 6px;
}

.log-detail__pre {
  margin: 0;
  padding: 12px;
  background-color: var(--el-fill-color-light);
  border-radius: 6px;
  font-family: 'JetBrains Mono', Menlo, Consolas, monospace;
  font-size: 12px;
  line-height: 1.5;
  white-space: pre-wrap;
  word-break: break-all;
  max-height: 240px;
  overflow: auto;
}
</style>
