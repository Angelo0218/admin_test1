<script setup lang="ts">
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage } from 'element-plus'
import { createRole, updateRole } from '@/api/role'
import { $t } from '@/locales'
import { parseApiError } from '@/utils/error'

interface Props {
  modelValue: boolean
  /** Row passed in when editing; null when creating */
  role: Api.Role.Row | null
}

const props = defineProps<Props>()
const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  saved: [row: Api.Role.Row]
}>()

const visible = computed({
  get: () => props.modelValue,
  set: (v) => emit('update:modelValue', v)
})

const isEdit = computed(() => props.role !== null)
const title = computed(() => $t(isEdit.value ? 'page.roleMgmt.editRole' : 'page.roleMgmt.addRole'))

const formRef = ref<FormInstance | null>(null)
const submitting = ref(false)

const form = reactive<Api.Role.CreatePayload>({
  code: '',
  name: '',
  description: '',
  enabled: true
})

const rules = computed<FormRules>(() => ({
  code: [
    { required: true, message: $t('page.roleMgmt.validation.codeRequired'), trigger: 'blur' },
    {
      pattern: /^[A-Za-z0-9_]{3,20}$/,
      message: $t('page.roleMgmt.validation.codeFormat'),
      trigger: 'blur'
    }
  ],
  name: [
    { required: true, message: $t('page.roleMgmt.validation.nameRequired'), trigger: 'blur' },
    { min: 1, max: 30, message: $t('page.roleMgmt.validation.nameLength'), trigger: 'blur' }
  ],
  description: [
    { max: 200, message: $t('page.roleMgmt.validation.descriptionLength'), trigger: 'blur' }
  ]
}))

watch(
  () => props.modelValue,
  (open) => {
    if (!open) return
    if (props.role) {
      form.code = props.role.code
      form.name = props.role.name
      form.description = props.role.description
      form.enabled = props.role.enabled
    } else {
      form.code = ''
      form.name = ''
      form.description = ''
      form.enabled = true
    }
    nextTick(() => formRef.value?.clearValidate())
  }
)

async function onSubmit() {
  const valid = await formRef.value?.validate().catch(() => false)
  if (!valid) return

  submitting.value = true
  try {
    let row: Api.Role.Row
    if (isEdit.value && props.role) {
      row = await updateRole(props.role.id, {
        name: form.name.trim(),
        description: form.description.trim(),
        enabled: form.enabled
      })
      ElMessage.success($t('page.roleMgmt.updateSuccess', { name: row.name }))
    } else {
      row = await createRole({
        code: form.code.trim(),
        name: form.name.trim(),
        description: form.description.trim(),
        enabled: form.enabled
      })
      ElMessage.success($t('page.roleMgmt.createSuccess', { name: row.name }))
    }
    emit('saved', row)
    visible.value = false
  } catch (err) {
    const parsed = parseApiError(err)
    if (parsed.code === 'DUPLICATE_CODE') {
      ElMessage.error($t('page.roleMgmt.validation.codeDuplicated'))
    } else {
      ElMessage.error(parsed.message)
    }
  } finally {
    submitting.value = false
  }
}

function onCancel() {
  visible.value = false
}
</script>

<template>
  <el-dialog
    v-model="visible"
    :title="title"
    width="480px"
    :close-on-click-modal="false"
    align-center
    destroy-on-close
  >
    <el-form ref="formRef" :model="form" :rules="rules" label-width="80px" label-position="right">
      <el-form-item prop="code" :label="$t('page.roleMgmt.form.code')">
        <el-input
          v-model="form.code"
          :placeholder="$t('page.roleMgmt.form.codePlaceholder')"
          :disabled="isEdit"
        />
        <small v-if="isEdit" class="role-form__hint">{{ $t('page.roleMgmt.form.codeHint') }}</small>
      </el-form-item>

      <el-form-item prop="name" :label="$t('page.roleMgmt.form.name')">
        <el-input
          v-model="form.name"
          :placeholder="$t('page.roleMgmt.form.namePlaceholder')"
          maxlength="30"
          show-word-limit
        />
      </el-form-item>

      <el-form-item prop="description" :label="$t('page.roleMgmt.form.description')">
        <el-input
          v-model="form.description"
          type="textarea"
          :placeholder="$t('page.roleMgmt.form.descriptionPlaceholder')"
          :rows="3"
          maxlength="200"
          show-word-limit
        />
      </el-form-item>

      <el-form-item prop="enabled" :label="$t('page.roleMgmt.form.enabled')">
        <el-switch v-model="form.enabled" />
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button @click="onCancel">{{ $t('common.cancel') }}</el-button>
      <el-button type="primary" :loading="submitting" @click="onSubmit">
        {{ $t('common.confirm') }}
      </el-button>
    </template>
  </el-dialog>
</template>

<style scoped lang="scss">
.role-form__hint {
  display: block;
  margin-top: 4px;
  color: var(--el-text-color-secondary);
  font-size: 12px;
}
</style>
