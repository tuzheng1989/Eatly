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
        <n-select
          :value="dish"
          :options="poolOptions[group as keyof typeof poolOptions]"
          @update:value="(value: string) => editableMeals[group as keyof typeof editableMeals] = value"
          filterable
          size="small"
          style="flex: 1"
        />
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
import { NButton, NTag, NSelect } from 'naive-ui'
import type { Recommendation, MealGroup, PoolType } from '@/types'
import { useSchemeStore } from '@/stores'
import dayjs from 'dayjs'

const props = defineProps<{
  recommendation: Recommendation
}>()

const emit = defineEmits<{
  edit: []
  confirm: []
  update: [meals: MealGroup]
}>()

const schemeStore = useSchemeStore()

// 编辑状态
const isEditing = ref(false)
const editableMeals = ref<MealGroup>({ A: '', B: '', C: '' })

// 池子选项（从当前方案获取）
const poolOptions = computed(() => {
  const pools = schemeStore.currentPools
  return {
    A: pools.A.map(dish => ({ label: dish, value: dish })),
    B: pools.B.map(dish => ({ label: dish, value: dish })),
    C: pools.C.map(dish => ({ label: dish, value: dish }))
  }
})

function formatDate(date: string) {
  return dayjs(date).format('YYYY年MM月DD日')
}

function startEdit() {
  editableMeals.value = { ...props.recommendation.meals }
  isEditing.value = true
}

function cancelEdit() {
  isEditing.value = false
}

function saveEdit() {
  emit('update', editableMeals.value)
  isEditing.value = false
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
}

.date {
  font-weight: bold;
  margin-bottom: 0.5rem;
}

.meals {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}

.meal-item {
  display: flex;
  gap: 0.5rem;
}

.group-label {
  font-weight: bold;
  color: var(--color-primary);
}

.actions {
  display: flex;
  gap: 0.5rem;
}
</style>
