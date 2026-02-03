<template>
  <div class="calendar">
    <h1>日历视图 📅</h1>

    <CalendarView
      :current-date="currentDate"
      :records="records"
      @date-click="handleDateClick"
      @month-change="handleMonthChange"
    />

    <n-modal v-model:show="showModal" preset="card" title="记录详情" style="width: 600px">
      <div v-if="selectedRecord">
        <p><strong>日期:</strong> {{ selectedRecord.date }}</p>
        <p><strong>A组:</strong> {{ selectedRecord.meals.A }}</p>
        <p><strong>B组:</strong> {{ selectedRecord.meals.B }}</p>
        <p><strong>C组:</strong> {{ selectedRecord.meals.C }}</p>
        <p v-if="selectedRecord.note"><strong>备注:</strong> {{ selectedRecord.note }}</p>
      </div>
      <n-empty v-else description="该日期无记录" />
    </n-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { NModal, NEmpty } from 'naive-ui'
import CalendarView from '@/components/calendar/CalendarView.vue'
import { useRecordStore } from '@/stores'
import { storeToRefs } from 'pinia'
import dayjs from 'dayjs'

const recordStore = useRecordStore()
const { records } = storeToRefs(recordStore)

const currentDate = ref(new Date())
const showModal = ref(false)
const selectedDate = ref<Date | null>(null)

const selectedRecord = computed(() => {
  if (!selectedDate.value) return null
  const dateStr = dayjs(selectedDate.value).format('YYYY-MM-DD')
  return records.value.find(r => r.date === dateStr)
})

function handleDateClick(date: Date) {
  selectedDate.value = date
  showModal.value = true
}

function handleMonthChange(date: Date) {
  currentDate.value = date
}

onMounted(async () => {
  await recordStore.loadRecords()
})
</script>

<style scoped>
.calendar {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}
</style>
