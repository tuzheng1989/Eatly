<template>
  <n-message-provider>
    <slot />
  </n-message-provider>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useMessage } from 'naive-ui'
import { NMessageProvider } from 'naive-ui'

/**
 * 全局消息提供者组件
 *
 * 功能：
 * 1. 提供 Naive UI 的 message provider
 * 2. 初始化全局 window.$message API
 * 3. 包裹应用所有内容
 *
 * 使用方法：
 * <GlobalMessageProvider>
 *   <App />
 * </GlobalMessageProvider>
 */
onMounted(() => {
  try {
    // 初始化全局 message API
    const message = useMessage()

    // 将 message API 挂载到 window 对象，方便全局使用
    Object.defineProperty(window, '$message', {
      get() {
        return message
      }
    })

    console.log('✅ Global message API initialized successfully')
  } catch (error) {
    console.error('❌ Failed to initialize global message API:', error)
  }
})
</script>
