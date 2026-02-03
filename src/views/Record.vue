<template>
  <div class="record">
    <h1>记录饮食 📝</h1>

    <n-form :model="formValue" label-placement="left" label-width="80">
      <n-form-item label="日期">
        <n-input v-model:value="formValue.date" placeholder="YYYY-MM-DD" />
      </n-form-item>
      <n-form-item label="A组菜品">
        <n-input v-model:value="formValue.meals.A" placeholder="输入菜品名称" />
      </n-form-item>
      <n-form-item label="B组菜品">
        <n-input v-model:value="formValue.meals.B" placeholder="输入菜品名称" />
      </n-form-item>
      <n-form-item label="C组菜品">
        <n-input v-model:value="formValue.meals.C" placeholder="输入菜品名称" />
      </n-form-item>
      <n-form-item label="备注">
        <n-input v-model:value="formValue.note" type="textarea" placeholder="可选备注" />
      </n-form-item>
      <n-form-item>
        <n-button type="primary" :loading="loading" @click="handleSubmit">
          保存记录
        </n-button>
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
import { ref, onMounted } from 'vue'
import { NForm, NFormItem, NInput, NButton, NDivider, NList, NListItem, NEmpty } from 'naive-ui'
import { useRecordStore } from '@/stores'
import { storeToRefs } from 'pinia'
import type { MealGroup } from '@/types'

const recordStore = useRecordStore()
const { records, loading } = storeToRefs(recordStore)

const formValue = ref({
  date: new Date().toISOString().split('T')[0],
  meals: {
    A: '',
    B: '',
    C: ''
  } as MealGroup,
  note: ''
})

async function handleSubmit() {
  if (!formValue.value.meals.A || !formValue.value.meals.B || !formValue.value.meals.C) {
    window.$message?.error('请填写所有菜品')
    return
  }

  await recordStore.createRecord({
    date: formValue.value.date,
    schemeId: '',
    schemeName: '手动记录',
    meals: formValue.value.meals,
    note: formValue.value.note
  })

  window.$message?.success('记录已保存')
  formValue.value.meals = { A: '', B: '', C: '' }
  formValue.value.note = ''
}

async function handleDelete(id: string) {
  await recordStore.deleteRecord(id)
  window.$message?.success('记录已删除')
}

onMounted(async () => {
  await recordStore.loadRecords()
})
</script>

<style scoped>
.record {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

.record-item {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.record-item .date {
  font-weight: bold;
  min-width: 100px;
}
</style>
