import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Settings } from '@/types'

const DEFAULT_SETTINGS: Settings = {
  defaultRecommendCount: 1,
  currentSchemeId: '',
  theme: 'auto',
  language: 'zh-CN',
  dateFormat: 'YYYY-MM-DD',
  chartGranularity: 'week'
}

export const useAppStore = defineStore('app', () => {
  const settings = ref<Settings>({ ...DEFAULT_SETTINGS })
  const toast = ref<{ message: string; type: 'success' | 'error' | 'info' } | null>(null)

  async function loadSettings() {
    const saved = localStorage.getItem('settings')
    if (saved) {
      try {
        settings.value = { ...DEFAULT_SETTINGS, ...JSON.parse(saved) }
      } catch (e) {
        console.error('Failed to load settings:', e)
      }
    }
  }

  async function updateSettings(updates: Partial<Settings>) {
    settings.value = { ...settings.value, ...updates }
    localStorage.setItem('settings', JSON.stringify(settings.value))
  }

  function showToast(message: string, type: 'success' | 'error' | 'info' = 'info') {
    toast.value = { message, type }
    setTimeout(() => {
      toast.value = null
    }, 3000)
  }

  return {
    settings,
    toast,
    loadSettings,
    updateSettings,
    showToast
  }
})
