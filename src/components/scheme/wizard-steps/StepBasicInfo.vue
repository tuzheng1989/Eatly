<template>
  <n-form ref="formRef" :model="localData" :rules="rules" label-placement="left" label-width="80px">
    <n-form-item label="方案名称" path="name">
      <n-input v-model:value="localData.name" placeholder="请输入方案名称" @input="handleUpdate" />
    </n-form-item>
    <n-form-item label="方案描述" path="description">
      <n-input
        v-model:value="localData.description"
        type="textarea"
        placeholder="可选，简单描述此方案的用途"
        :rows="3"
        @input="handleUpdate"
      />
    </n-form-item>
  </n-form>
</template>

<script setup lang="ts">
import { ref, inject, watch } from 'vue'
import { NForm, NFormItem, NInput } from 'naive-ui'
import type { FormInst, FormRules } from 'naive-ui'

const wizardData = inject<Ref<{ name: string; description: string }>>('wizardData')!
const wizardUpdate = inject<(data: Partial<{ name: string; description: string }>) => void>('wizardUpdate')!

const formRef = ref<FormInst>()
const localData = ref({ name: '', description: '' })

const rules: FormRules = {
  name: [
    { required: true, message: '请输入方案名称', trigger: 'blur' },
    { min: 2, max: 20, message: '名称长度应在2-20字符之间', trigger: 'blur' }
  ]
}

watch(
  () => wizardData.value,
  (data) => {
    localData.value.name = data.name
    localData.value.description = data.description || ''
  },
  { immediate: true }
)

function handleUpdate() {
  wizardUpdate({ name: localData.value.name, description: localData.value.description })
}

async function validate() {
  try {
    await formRef.value?.validate()
    return true
  } catch {
    return false
  }
}

defineExpose({ validate })
</script>
