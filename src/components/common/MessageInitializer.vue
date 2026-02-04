<template>
  <slot />
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useMessage } from 'naive-ui'

/**
 * 消息 API 初始化器组件
 *
 * 功能：
 * 1. 作为 n-message-provider 的直接子组件
 * 2. 初始化全局 window.$message API
 * 3. 渲染子组件内容
 *
 * 设计原理：
 * - useMessage() 必须在 <n-message-provider> 的子组件中调用
 * - 通过内部组件避免在 provider 组件本身的 setup 中调用
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
