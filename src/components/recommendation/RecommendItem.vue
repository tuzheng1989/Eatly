<template>
  <div class="recommend-item">
    <div class="date">{{ formatDate(recommendation.date) }}</div>

    <!-- 查看模式 -->
    <div v-if="!isEditing" class="meals">
      <div v-for="(dish, group) in recommendation.meals" :key="group" class="meal-item">
        <span class="group-label">{{ group }}组:</span>
        <span class="dish-name">{{ dish }}</span>
      </div>
    </div>

    <!-- 编辑模式 -->
    <div v-else class="meals-edit">
      <div v-for="(dish, group) in editableMeals" :key="group" class="meal-edit-item">
        <span class="group-label">{{ group }}组:</span>
        <div class="meal-edit-content">
          <n-select
            :value="dish"
            :options="poolOptions[group as keyof typeof poolOptions]"
            @update:value="(value: string) => handleMealChange(group as keyof typeof editableMeals, value)"
            filterable
            size="small"
            style="flex: 1"
          />
          <n-input
            v-if="dish === '其他'"
            :value="customMeals[group as keyof typeof customMeals]"
            @update:value="(value: string) => customMeals[group as keyof typeof customMeals] = value"
            placeholder="请输入自定义菜品名称"
            size="small"
            clearable
            style="flex: 1; margin-top: 0.5rem"
          />
        </div>
      </div>
    </div>

    <!-- 操作按钮 -->
    <div v-if="!recommendation.isConfirmed" class="actions">
      <template v-if="!isEditing">
        <n-button size="small" @click="startEdit">编辑</n-button>
        <n-button type="primary" size="small" @click="handleConfirm">确认</n-button>
      </template>
      <template v-else>
        <n-button size="small" @click="cancelEdit">取消</n-button>
        <n-button type="primary" size="small" @click="saveEdit">保存</n-button>
      </template>
    </div>
    <div v-else class="confirmed">
      <n-tag type="success">已确认</n-tag>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { NButton, NTag, NSelect, NInput } from 'naive-ui'
import type { Recommendation, MealGroup, PoolGroup, PoolType } from '@/types'
import { useRecommendationStore, useSchemeStore } from '@/stores'
import dayjs from 'dayjs'

const props = defineProps<{
  recommendation: Recommendation
}>()

const emit = defineEmits<{
  edit: []
  confirm: []
  update: [meals: MealGroup]
}>()

const recommendStore = useRecommendationStore()
const schemeStore = useSchemeStore()

// 编辑状态
const isEditing = ref(false)
const editableMeals = ref<MealGroup>({ A: '', B: '', C: '' })

// 自定义菜品名称（当选择"其他"时使用）
const customMeals = ref<MealGroup>({ A: '', B: '', C: '' })

// 池子选项（从剩余池子获取）
const poolOptions = computed(() => {
  const pools = recommendStore.remainingPools
  const createOptions = (items: string[]) => [
    ...items.map(item => ({ label: item, value: item })),
    { label: '其他', value: '其他' }
  ]

  return {
    A: createOptions(pools.A),
    B: createOptions(pools.B),
    C: createOptions(pools.C)
  }
})

function formatDate(date: string) {
  return dayjs(date).format('YYYY年MM月DD日')
}

function startEdit() {
  editableMeals.value = { ...props.recommendation.meals }
  customMeals.value = { A: '', B: '', C: '' }
  isEditing.value = true
}

function cancelEdit() {
  isEditing.value = false
  customMeals.value = { A: '', B: '', C: '' }
}

function handleMealChange(group: keyof MealGroup, value: string) {
  editableMeals.value[group] = value
  if (value === '其他') {
    customMeals.value[group] = ''
  }
}

function saveEdit() {
  // 处理"其他"菜品：使用自定义名称或默认为"其他"
  const processedMeals: MealGroup = {
    A: editableMeals.value.A === '其他' ? (customMeals.value.A || '其他') : editableMeals.value.A,
    B: editableMeals.value.B === '其他' ? (customMeals.value.B || '其他') : editableMeals.value.B,
    C: editableMeals.value.C === '其他' ? (customMeals.value.C || '其他') : editableMeals.value.C
  }

  emit('update', processedMeals)
  isEditing.value = false
  customMeals.value = { A: '', B: '', C: '' }
}

function handleEdit() {
  startEdit()
}

function handleConfirm() {
  emit('confirm')
}
</script>

<style scoped>
.recommend-item {
  padding: 1rem;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  margin-bottom: 1rem;
  background: white;
}

.date {
  font-weight: bold;
  margin-bottom: 0.5rem;
  color: var(--color-text);
}

.meals {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.meals-edit {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1rem;
  padding: 1rem;
  background: #f5f5f5;
  border-radius: 4px;
}

.meal-item {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.meal-edit-item {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.group-label {
  font-weight: bold;
  color: var(--color-primary);
  min-width: 50px;
}

.dish-name {
  color: var(--color-text);
}

.actions {
  display: flex;
  gap: 0.5rem;
}

.confirmed {
  display: flex;
  justify-content: flex-end;
}
</style>
