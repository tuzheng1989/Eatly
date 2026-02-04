<template>
  <div class="record">
    <h1>记录饮食 📝</h1>

    <!-- 当前方案提示 -->
    <n-alert v-if="currentScheme" type="info" style="margin-bottom: 1.5rem">
      当前方案：<strong>{{ currentScheme.name }}</strong>
      <template v-if="currentScheme.description">
        - {{ currentScheme.description }}
      </template>
    </n-alert>
    <n-alert v-else type="warning" style="margin-bottom: 1.5rem">
      未选择方案，请先在方案管理中选择一个方案
    </n-alert>

    <n-form ref="formRef" :model="formValue" :rules="rules" label-placement="left" label-width="100">
      <n-form-item label="记录日期" path="date">
        <n-date-picker
          v-model:formatted-value="formValue.date"
          value-format="yyyy-MM-dd"
          type="date"
          placeholder="选择日期"
          style="width: 100%"
          clearable
        />
      </n-form-item>

      <n-form-item label="A组菜品" path="meals.A">
        <n-select
          v-model:value="formValue.meals.A"
          :options="poolOptions.A"
          placeholder="请选择A组菜品"
          filterable
          tag
          clearable
        />
      </n-form-item>

      <n-form-item label="B组菜品" path="meals.B">
        <n-select
          v-model:value="formValue.meals.B"
          :options="poolOptions.B"
          placeholder="请选择B组菜品"
          filterable
          tag
          clearable
        />
      </n-form-item>

      <n-form-item label="C组菜品" path="meals.C">
        <n-select
          v-model:value="formValue.meals.C"
          :options="poolOptions.C"
          placeholder="请选择C组菜品"
          filterable
          tag
          clearable
        />
      </n-form-item>

      <n-form-item label="备注">
        <n-input
          v-model:value="formValue.note"
          type="textarea"
          placeholder="可选备注"
          :rows="3"
        />
      </n-form-item>

      <n-form-item>
        <n-space>
          <n-button type="primary" :loading="loading" @click="handleSubmit">
            保存记录
          </n-button>
          <n-button @click="handleReset">
            重置表单
          </n-button>
        </n-space>
      </n-form-item>
    </n-form>

    <n-divider />

    <h2>最近记录</h2>
    <n-list v-if="records.length > 0">
      <n-list-item v-for="record in records" :key="record.id">
        <div class="record-item">
          <span class="date">{{ record.date }}</span>
          <span class="meals">
            A: {{ record.meals.A }} | B: {{ record.meals.B }} | C: {{ record.meals.C }}
          </span>
          <n-button size="small" type="error" @click="handleDelete(record.id)">删除</n-button>
        </div>
      </n-list-item>
    </n-list>
    <n-empty v-else description="暂无记录" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import {
  NForm,
  NFormItem,
  NInput,
  NButton,
  NDivider,
  NList,
  NListItem,
  NEmpty,
  NDatePicker,
  NSelect,
  NSpace,
  NAlert,
  type FormInst,
  type FormRules
} from 'naive-ui'
import { useRecordStore, useSchemeStore } from '@/stores'
import { storeToRefs } from 'pinia'
import type { MealGroup } from '@/types'
import dayjs from 'dayjs'

const recordStore = useRecordStore()
const { records, loading } = storeToRefs(recordStore)

const schemeStore = useSchemeStore()
const { currentScheme } = storeToRefs(schemeStore)

const formRef = ref<FormInst>()

// 表单验证规则
const rules: FormRules = {
  date: [
    { required: true, message: '请选择日期', trigger: 'blur' }
  ],
  'meals.A': [
    { required: true, message: '请选择A组菜品', trigger: 'change' }
  ],
  'meals.B': [
    { required: true, message: '请选择B组菜品', trigger: 'change' }
  ],
  'meals.C': [
    { required: true, message: '请选择C组菜品', trigger: 'change' }
  ]
}

// 菜品池选项（从当前方案中获取）
const poolOptions = computed(() => {
  if (!currentScheme.value?.pools) {
    return { A: [], B: [], C: [] }
  }

  const createOptions = (items: string[]) =>
    items.map(item => ({ label: item, value: item }))

  return {
    A: createOptions(currentScheme.value.pools.A),
    B: createOptions(currentScheme.value.pools.B),
    C: createOptions(currentScheme.value.pools.C)
  }
})

const formValue = ref({
  date: dayjs().format('YYYY-MM-DD'),
  meals: {
    A: null as string | null,
    B: null as string | null,
    C: null as string | null
  } as MealGroup & { A: string | null; B: string | null; C: string | null },
  note: ''
})

async function handleSubmit() {
  try {
    await formRef.value?.validate()

    // 验证菜品是否已选择
    if (!formValue.value.meals.A || !formValue.value.meals.B || !formValue.value.meals.C) {
      window.$message?.error('请选择所有菜品')
      return
    }

    await recordStore.createRecord({
      date: formValue.value.date,
      schemeId: currentScheme.value?.id || '',
      schemeName: currentScheme.value?.name || '手动记录',
      meals: {
        A: formValue.value.meals.A,
        B: formValue.value.meals.B,
        C: formValue.value.meals.C
      } as MealGroup,
      note: formValue.value.note
    })

    window.$message?.success('记录已保存')
    handleReset()
  } catch (error) {
    // 表单验证失败，不做处理
    console.log('表单验证失败:', error)
  }
}

function handleReset() {
  formValue.value = {
    date: dayjs().format('YYYY-MM-DD'),
    meals: {
      A: null,
      B: null,
      C: null
    } as MealGroup & { A: string | null; B: string | null; C: string | null },
    note: ''
  }
  formRef.value?.restoreValidation()
}

async function handleDelete(id: string) {
  await recordStore.deleteRecord(id)
  window.$message?.success('记录已删除')
}

onMounted(async () => {
  await recordStore.loadRecords()
  await schemeStore.loadSchemes()
})
</script>

<style scoped>
.record {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

.record h1 {
  margin-bottom: 1.5rem;
  color: var(--n-text-color);
}

.record h2 {
  margin-top: 2rem;
  margin-bottom: 1rem;
  color: var(--n-text-color-2);
}

.record-item {
  display: flex;
  gap: 1rem;
  align-items: center;
  padding: 0.75rem 0;
  border-bottom: 1px solid var(--n-border-color);
}

.record-item:last-child {
  border-bottom: none;
}

.record-item .date {
  font-weight: bold;
  min-width: 100px;
  color: var(--n-text-color);
}

.record-item .meals {
  flex: 1;
  color: var(--n-text-color-2);
}

/* 表单项间距优化 */
:deep(.n-form-item) {
  margin-bottom: 1.25rem;
}

/* 日期选择器宽度优化 */
:deep(.n-date-picker) {
  width: 100%;
}

/* 选择器下拉菜单宽度优化 */
:deep(.n-select) {
  width: 100%;
}
</style>
