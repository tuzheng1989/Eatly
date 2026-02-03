<template>
  <div class="recommend-item">
    <div class="date">{{ formatDate(recommendation.date) }}</div>
    <div class="meals">
      <div class="meal-item" v-for="(dish, group) in recommendation.meals" :key="group">
        <span class="group-label">{{ group }}组:</span>
        <span class="dish-name">{{ dish }}</span>
      </div>
    </div>
    <div class="actions" v-if="!recommendation.isConfirmed">
      <n-button size="small" @click="handleEdit">编辑</n-button>
      <n-button type="primary" size="small" @click="handleConfirm">确认</n-button>
    </div>
    <div class="confirmed" v-else>
      <n-tag type="success">已确认</n-tag>
    </div>
  </div>
</template>

<script setup lang="ts">
import { NButton, NTag } from 'naive-ui'
import type { Recommendation } from '@/types'
import dayjs from 'dayjs'

const props = defineProps<{
  recommendation: Recommendation
}>()

const emit = defineEmits<{
  edit: []
  confirm: []
}>()

function formatDate(date: string) {
  return dayjs(date).format('YYYY年MM月DD日')
}

function handleEdit() {
  emit('edit')
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
