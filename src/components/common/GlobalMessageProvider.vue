<template>
  <n-message-provider>
    <MessageInitializer>
      <slot />
    </MessageInitializer>
  </n-message-provider>
</template>

<script setup lang="ts">
import { NMessageProvider } from 'naive-ui'
import MessageInitializer from './MessageInitializer.vue'

/**
 * 全局消息提供者组件
 *
 * 功能：
 * 1. 提供 Naive UI 的 message provider
 * 2. 通过内部组件 MessageInitializer 初始化全局 window.$message API
 * 3. 包裹应用所有内容
 *
 * 使用方法：
 * <GlobalMessageProvider>
 *   <App />
 * </GlobalMessageProvider>
 *
 * 设计原理：
 * - useMessage() 必须在 <n-message-provider> 的子组件中调用
 * - 通过 MessageInitializer 内部组件避免在本组件的 setup 中调用
 */
</script>
