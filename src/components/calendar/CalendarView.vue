<template>
  <div class="calendar-view">
    <div class="calendar-header">
      <n-button text @click="previousMonth">
        <template #icon>
          <n-icon><ChevronBack /></n-icon>
        </template>
      </n-button>
      <h3>{{ currentMonth }}</h3>
      <n-button text @click="nextMonth">
        <template #icon>
          <n-icon><ChevronForward /></n-icon>
        </template>
      </n-button>
    </div>

    <div class="calendar-weekdays">
      <div v-for="day in weekdays" :key="day" class="weekday">{{ day }}</div>
    </div>

    <div class="calendar-days">
      <div
        v-for="day in calendarDays"
        :key="day.date.getTime()"
        :class="['day-cell', {
          'has-record': day.hasRecord,
          'other-month': !day.isCurrentMonth,
          'is-today': day.isToday
        }]"
        @click="handleDateClick(day.date)"
      >
        <div class="day-number">{{ day.date.getDate() }}</div>
        <div v-if="day.hasRecord && day.record" class="day-meals">
          <div class="meal-item meal-a">{{ day.record.meals.A }}</div>
          <div class="meal-item meal-b">{{ day.record.meals.B }}</div>
          <div class="meal-item meal-c">{{ day.record.meals.C }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { NButton, NIcon } from 'naive-ui'
import { ChevronBack, ChevronForward } from '@vicons/ionicons5'
import type { Record } from '@/types'
import dayjs from 'dayjs'

const props = defineProps<{
  currentDate: Date
  records: Record[]
}>()

const emit = defineEmits<{
  'date-click': [date: Date]
  'month-change': [date: Date]
}>()

const weekdays = ['日', '一', '二', '三', '四', '五', '六']

const currentMonth = computed(() => {
  return dayjs(props.currentDate).format('YYYY年MM月')
})

const calendarDays = computed(() => {
  const year = props.currentDate.getFullYear()
  const month = props.currentDate.getMonth()

  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)

  const startDayOfWeek = firstDay.getDay()
  const daysInMonth = lastDay.getDate()

  const today = new Date()
  const isToday = (date: Date) =>
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()

  const days: Array<{
    date: Date
    hasRecord: boolean
    isCurrentMonth: boolean
    isToday: boolean
    record?: Record
  }> = []

  // 填充月初空白
  for (let i = 0; i < startDayOfWeek; i++) {
    const date = new Date(year, month, -startDayOfWeek + i + 1)
    days.push({
      date,
      hasRecord: false,
      isCurrentMonth: false,
      isToday: false
    })
  }

  // 填充当月日期
  for (let i = 1; i <= daysInMonth; i++) {
    const date = new Date(year, month, i)
    const dateStr = dayjs(date).format('YYYY-MM-DD')
    const record = props.records.find(r => r.date === dateStr)
    const hasRecord = !!record
    const isTodayDate = isToday(date)
    days.push({
      date,
      hasRecord,
      isCurrentMonth: true,
      isToday: isTodayDate,
      record: record || undefined
    })
  }

  return days
})

function previousMonth() {
  const newDate = new Date(props.currentDate)
  newDate.setMonth(newDate.getMonth() - 1)
  emit('month-change', newDate)
}

function nextMonth() {
  const newDate = new Date(props.currentDate)
  newDate.setMonth(newDate.getMonth() + 1)
  emit('month-change', newDate)
}

function handleDateClick(date: Date) {
  emit('date-click', date)
}
</script>

<style scoped>
.calendar-view {
  width: 100%;
}

.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.calendar-weekdays {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.weekday {
  text-align: center;
  font-weight: bold;
  color: var(--color-text-secondary);
}

.calendar-days {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 0.5rem;
}

.day-cell {
  min-height: 100px;
  display: flex;
  flex-direction: column;
  padding: 0.5rem;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
  background: white;
  border: 1px solid #e0e0e0;
  position: relative;
}

.day-cell:hover {
  background: #f5f5f5;
  transform: scale(1.02);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.day-number {
  font-size: 1.1rem;
  font-weight: bold;
  margin-bottom: 0.25rem;
}

.day-meals {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
  overflow: hidden;
}

.meal-item {
  font-size: 0.7rem;
  padding: 0.1rem 0.25rem;
  border-radius: 2px;
  line-height: 1.2;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.meal-a {
  background: rgba(255, 255, 255, 0.2);
  border-left: 2px solid #ff6b6b;
}

.meal-b {
  background: rgba(255, 255, 255, 0.2);
  border-left: 2px solid #4ecdc4;
}

.meal-c {
  background: rgba(255, 255, 255, 0.2);
  border-left: 2px solid #ffe66d;
}

/* 有记录的日期：绿色背景（最高优先级） */
.day-cell.has-record {
  background: #42b983;
  color: white;
  border: 2px solid #42b983;
  box-shadow: 0 2px 4px rgba(66, 185, 131, 0.3);
}

.day-cell.has-record .meal-item {
  background: rgba(255, 255, 255, 0.15);
}

.day-cell.has-record .meal-a {
  border-left-color: rgba(255, 107, 107, 0.8);
}

.day-cell.has-record .meal-b {
  border-left-color: rgba(78, 205, 196, 0.8);
}

.day-cell.has-record .meal-c {
  border-left-color: rgba(255, 230, 109, 0.8);
}

/* 今天没有记录：黄色背景 */
.day-cell.is-today:not(.has-record) {
  background: #ffd666;
  border-color: #ffa8a8;
}

.day-cell.is-today:not(.has-record):hover {
  background: #ffc4c4;
}

/* 有记录的今天：保持绿色背景 */
.day-cell.is-today.has-record {
  background: #42b983;
  color: white;
  font-weight: bold;
  border: 2px solid #42b983;
  box-shadow: 0 2px 4px rgba(66, 185, 131, 0.3);
}

.day-cell.other-month {
  opacity: 0.3;
}

.day-cell.other-month .day-meals {
  display: none;
}
</style>
