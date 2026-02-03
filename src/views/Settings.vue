<template>
  <div class="settings-page">
    <h1>设置 ⚙️</h1>

    <!-- 外观设置 -->
    <div class="settings-section">
      <h2 class="section-title">外观设置</h2>
      <p class="section-desc">自定义应用外观</p>

      <div class="setting-item">
        <div class="setting-label">
          <span class="label-text">主题模式</span>
          <span class="label-desc">选择应用的主题外观</span>
        </div>
        <div class="setting-control">
          <label class="radio-option">
            <input v-model="settings.theme" type="radio" value="light" @change="handleThemeChange" />
            <span class="radio-icon">☀️</span>
            浅色
          </label>
          <label class="radio-option">
            <input v-model="settings.theme" type="radio" value="dark" @change="handleThemeChange" />
            <span class="radio-icon">🌙</span>
            深色
          </label>
          <label class="radio-option">
            <input v-model="settings.theme" type="radio" value="auto" @change="handleThemeChange" />
            <span class="radio-icon">💻</span>
            跟随系统
          </label>
        </div>
      </div>
    </div>

    <!-- 语言设置 -->
    <div class="settings-section">
      <h2 class="section-title">语言设置</h2>
      <p class="section-desc">选择应用显示语言</p>

      <div class="setting-item">
        <div class="setting-label">
          <span class="label-text">语言</span>
          <span class="label-desc">选择界面语言</span>
        </div>
        <div class="setting-control">
          <label class="radio-option">
            <input v-model="settings.language" type="radio" value="zh" @change="handleLanguageChange" />
            <span class="radio-icon">🇨🇳</span>
            中文
          </label>
          <label class="radio-option">
            <input v-model="settings.language" type="radio" value="en" @change="handleLanguageChange" />
            <span class="radio-icon">🇺🇸</span>
            English
          </label>
        </div>
      </div>
    </div>

    <!-- 存储信息 -->
    <div class="settings-section">
      <h2 class="section-title">存储信息</h2>
      <p class="section-desc">当前存储模式</p>

      <div class="info-list">
        <div class="info-item">
          <span class="info-label">存储模式：</span>
          <span class="tag" :class="storageMode === 'remote' ? 'tag-success' : 'tag-info'">
            {{ storageMode === 'remote' ? '☁️ 云端存储 (API)' : '💾 本地存储 (IndexedDB)' }}
          </span>
        </div>
        <div v-if="storageMode === 'remote'" class="info-item">
          <span class="info-label">API 地址：</span>
          <span class="info-value">{{ apiUrl }}</span>
        </div>
        <div class="info-item">
          <span class="info-label">环境：</span>
          <span class="tag tag-default">{{ isDev ? '🔧 开发环境' : '🚀 生产环境' }}</span>
        </div>
      </div>
    </div>

    <!-- 保存状态提示 -->
    <div v-if="saveStatus" class="save-status" :class="`save-status-${saveStatus.type}`">
      {{ saveStatus.message }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { AppSettings } from '@/services/settings.service'
import { settingsService } from '@/services/settings.service'

// 设置数据
const settings = ref<AppSettings>({
  theme: 'auto',
  language: 'zh'
})

// 保存状态
const saveStatus = ref<{ type: 'success' | 'error'; message: string } | null>(null)

// 存储信息
const storageMode = computed(() => import.meta.env.VITE_STORAGE_MODE || 'local')
const apiUrl = computed(() => import.meta.env.VITE_API_URL || 'http://localhost:4000/api')
const isDev = computed(() => import.meta.env.DEV)

// 显示保存状态
function showSaveStatus(type: 'success' | 'error', message: string) {
  saveStatus.value = { type, message }
  setTimeout(() => {
    saveStatus.value = null
  }, 3000)
}

// 处理主题变更
async function handleThemeChange() {
  try {
    await settingsService.updateSettings({ theme: settings.value.theme })
    showSaveStatus('success', '主题设置已保存')
    applyTheme(settings.value.theme)
  } catch (error: unknown) {
    console.error('保存主题失败:', error)
    const message = error instanceof Error ? error.message : '保存主题失败'
    showSaveStatus('error', message)
  }
}

// 处理语言变更
async function handleLanguageChange() {
  try {
    await settingsService.updateSettings({ language: settings.value.language })
    showSaveStatus('success', settings.value.language === 'zh' ? '语言已切换为中文' : 'Language switched to English')
  } catch (error: unknown) {
    console.error('保存语言失败:', error)
    const message = error instanceof Error ? error.message : '保存语言失败'
    showSaveStatus('error', message)
  }
}

// 应用主题
function applyTheme(theme: 'light' | 'dark' | 'auto') {
  const html = document.documentElement

  if (theme === 'auto') {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    html.classList.toggle('dark', prefersDark)
  } else {
    html.classList.toggle('dark', theme === 'dark')
  }
}

// 加载设置
async function loadSettings() {
  try {
    settings.value = await settingsService.getSettings()
    applyTheme(settings.value.theme)
  } catch (error) {
    console.error('加载设置失败:', error)
  }
}

// 初始化
loadSettings()
</script>

<style scoped>
.settings-page {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

h1 {
  font-size: 2rem;
  margin-bottom: 2rem;
  color: var(--n-text-color);
}

.settings-section {
  background: var(--n-card-color);
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  border: 1px solid var(--n-border-color);
}

.section-title {
  font-size: 1.125rem;
  font-weight: 600;
  margin: 0 0 0.25rem 0;
  color: var(--n-text-color);
}

.section-desc {
  font-size: 0.875rem;
  margin: 0 0 1rem 0;
  color: var(--n-text-color-3);
}

.setting-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2rem;
  padding: 1rem 0;
}

.setting-label {
  flex: 1;
}

.label-text {
  font-size: 0.9375rem;
  font-weight: 500;
  display: block;
  margin-bottom: 0.25rem;
  color: var(--n-text-color);
}

.label-desc {
  font-size: 0.8125rem;
  color: var(--n-text-color-3);
}

.setting-control {
  display: flex;
  gap: 0.75rem;
}

.radio-option {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.radio-option:hover {
  background: var(--n-button-color-2);
}

.radio-option input[type="radio"] {
  margin: 0;
  cursor: pointer;
}

.radio-icon {
  font-size: 1.25rem;
}

.info-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
}

.info-label {
  color: var(--n-text-color-3);
  min-width: 100px;
}

.info-value {
  color: var(--n-text-color);
  font-family: monospace;
  font-size: 0.8125rem;
}

.tag {
  padding: 0.25rem 0.75rem;
  border-radius: 4px;
  font-size: 0.8125rem;
  font-weight: 500;
}

.tag-success {
  background: #e6fffa;
  color: #00796b;
}

.tag-info {
  background: #e3f2fd;
  color: #0277bd;
}

.tag-default {
  background: #f5f5f5;
  color: #616161;
}

.save-status {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  padding: 1rem 1.5rem;
  border-radius: 8px;
  font-weight: 500;
  animation: slideIn 0.3s ease;
}

.save-status-success {
  background: #52c41a;
  color: white;
}

.save-status-error {
  background: #ff4d4f;
  color: white;
}

@keyframes slideIn {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
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

  .setting-control {
    flex-wrap: wrap;
  }
}
</style>
