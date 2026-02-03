<template>
  <div class="settings-page">
    <h1>设置 ⚙️</h1>

    <n-card class="settings-section">
      <template #header>
        <div class="section-header">
          <span class="section-title">外观设置</span>
          <span class="section-desc">自定义应用外观</span>
        </div>
      </template>

      <div class="setting-item">
        <div class="setting-label">
          <span class="label-text">主题模式</span>
          <span class="label-desc">选择应用的主题外观</span>
        </div>
        <n-radio-group v-model:value="settings.theme" @update:value="handleThemeChange">
          <n-radio-button value="light">
            <template #icon>
              <n-icon :component="SunOutline" />
            </template>
            浅色
          </n-radio-button>
          <n-radio-button value="dark">
            <template #icon>
              <n-icon :component="MoonOutline" />
            </template>
            深色
          </n-radio-button>
          <n-radio-button value="auto">
            <template #icon>
              <n-icon :component="DesktopOutline" />
            </template>
            跟随系统
          </n-radio-button>
        </n-radio-group>
      </div>
    </n-card>

    <n-card class="settings-section">
      <template #header>
        <div class="section-header">
          <span class="section-title">语言设置</span>
          <span class="section-desc">选择应用显示语言</span>
        </div>
      </template>

      <div class="setting-item">
        <div class="setting-label">
          <span class="label-text">语言</span>
          <span class="label-desc">选择界面语言</span>
        </div>
        <n-radio-group v-model:value="settings.language" @update:value="handleLanguageChange">
          <n-radio-button value="zh">🇨🇳 中文</n-radio-button>
          <n-radio-button value="en">🇺🇸 English</n-radio-button>
        </n-radio-group>
      </div>
    </n-card>

    <n-card class="settings-section">
      <template #header>
        <div class="section-header">
          <span class="section-title">存储信息</span>
          <span class="section-desc">当前存储模式</span>
        </div>
      </template>

      <div class="storage-info">
        <n-space vertical>
          <div class="info-item">
            <span class="info-label">存储模式：</span>
            <n-tag :type="storageMode === 'remote' ? 'success' : 'info'">
              {{ storageMode === 'remote' ? '云端存储 (API)' : '本地存储 (IndexedDB)' }}
            </n-tag>
          </div>
          <div class="info-item" v-if="storageMode === 'remote'">
            <span class="info-label">API 地址：</span>
            <span class="info-value">{{ apiUrl }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">环境：</span>
            <n-tag type="default">{{ isDev ? '开发环境' : '生产环境' }}</n-tag>
          </div>
        </n-space>
      </div>
    </n-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { NCard, NRadioGroup, NRadioButton, NIcon, NSpace, NTag } from 'naive-ui'
import { SunOutline, MoonOutline, DesktopOutline } from '@vicons/ionicons5'
import { settingsService } from '@/services/settings.service'
import type { AppSettings } from '@/services/settings.service'

// 设置数据
const settings = ref<AppSettings>({
  theme: 'auto',
  language: 'zh'
})

const loading = ref(false)

// Message proxy (will be set in onMounted)
let message: any = null

// 存储信息
const storageMode = computed(() => import.meta.env.VITE_STORAGE_MODE || 'local')
const apiUrl = computed(() => import.meta.env.VITE_API_URL || 'http://localhost:4000/api')
const isDev = computed(() => import.meta.env.DEV)

// 加载设置
async function loadSettings() {
  try {
    loading.value = true
    settings.value = await settingsService.getSettings()
  } catch (error: any) {
    console.error('加载设置失败:', error)
    message.error(error.message || '加载设置失败')
  } finally {
    loading.value = false
  }
}

// 处理主题变更
async function handleThemeChange(value: 'light' | 'dark' | 'auto') {
  try {
    loading.value = true
    await settingsService.updateSettings({ theme: value })
    settings.value.theme = value
    message.success('主题设置已保存')

    // 应用主题
    applyTheme(value)
  } catch (error: any) {
    console.error('保存主题失败:', error)
    message.error(error.message || '保存主题失败')
  } finally {
    loading.value = false
  }
}

// 处理语言变更
async function handleLanguageChange(value: 'zh' | 'en') {
  try {
    loading.value = true
    await settingsService.updateSettings({ language: value })
    settings.value.language = value
    message.success(value === 'zh' ? '语言已切换为中文' : 'Language switched to English')
  } catch (error: any) {
    console.error('保存语言失败:', error)
    message.error(error.message || '保存语言失败')
  } finally {
    loading.value = false
  }
}

// 应用主题
function applyTheme(theme: 'light' | 'dark' | 'auto') {
  const html = document.documentElement

  if (theme === 'auto') {
    // 跟随系统
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    html.classList.toggle('dark', prefersDark)
  } else {
    html.classList.toggle('dark', theme === 'dark')
  }
}

// 初始化
onMounted(async () => {
  await loadSettings()
  applyTheme(settings.value.theme)
})
</script>

<style scoped>
.settings-page {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

.settings-section {
  margin-bottom: 1.5rem;
}

.section-header {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.section-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--n-text-color);
}

.section-desc {
  font-size: 0.875rem;
  color: var(--n-text-color-3);
}

.setting-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2rem;
  padding: 0.5rem 0;
}

.setting-label {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.label-text {
  font-size: 0.9375rem;
  font-weight: 500;
  color: var(--n-text-color);
}

.label-desc {
  font-size: 0.8125rem;
  color: var(--n-text-color-3);
}

.storage-info {
  padding: 0.5rem 0;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
}

.info-label {
  color: var(--n-text-color-3);
}

.info-value {
  color: var(--n-text-color);
  font-family: monospace;
  font-size: 0.8125rem;
}

/* 暗色模式支持 */
:global(.dark) {
  color-scheme: dark;
}

/* 响应式 */
@media (max-width: 640px) {
  .settings-page {
    padding: 1rem;
  }

  .setting-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
}
</style>
