import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Record } from '@/types'
import { recordService } from '@/services'

export const useRecordStore = defineStore('record', () => {
  const records = ref<Record[]>([])
  const loading = ref(false)

  const recordsByDate = computed(() => {
    const map = new Map<string, Record>()
    records.value.forEach(record => {
      map.set(record.date, record)
    })
    return map
  })

  async function loadRecords(startDate?: string, endDate?: string) {
    loading.value = true
    try {
      records.value = await recordService.getByDateRange(startDate, endDate)
    } finally {
      loading.value = false
    }
  }

  async function createRecord(record: Omit<Record, 'id' | 'createdAt' | 'updatedAt'>) {
    const newRecord = await recordService.create(record)
    records.value.push(newRecord)
    return newRecord
  }

  async function updateRecord(id: string, updates: Partial<Record>) {
    const updated = await recordService.update(id, updates)
    const index = records.value.findIndex(r => r.id === id)
    if (index !== -1) {
      records.value[index] = updated
    }
  }

  async function deleteRecord(id: string) {
    await recordService.delete(id)
    records.value = records.value.filter(r => r.id !== id)
  }

  function getRecordByDate(date: string): Record | undefined {
    return recordsByDate.value.get(date)
  }

  return {
    records,
    loading,
    recordsByDate,
    loadRecords,
    createRecord,
    updateRecord,
    deleteRecord,
    getRecordByDate
  }
})
