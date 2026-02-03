<template>
  <n-config-provider :theme-overrides="themeOverrides">
    <n-message-provider>
      <n-loading-bar-provider>
        <AppHeader />
        <main class="main-content">
          <router-view />
        </main>
      </n-loading-bar-provider>
    </n-message-provider>
  </n-config-provider>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useMessage } from 'naive-ui'
import { NConfigProvider, NMessageProvider, NLoadingBarProvider } from 'naive-ui'
import AppHeader from '@/components/common/AppHeader.vue'

const themeOverrides = {
  common: {
    primaryColor: '#42b983',
    primaryColorHover: '#33a06f',
    primaryColorPressed: '#2c8a60'
  }
}

// Expose message API for global use after component is mounted
// This ensures NMessageProvider is available when useMessage is called
onMounted(() => {
  try {
    const message = useMessage()
    Object.defineProperty(window, '$message', {
      get() {
        return message
      }
    })
  } catch (error) {
    console.warn('Failed to initialize message API:', error)
  }
})
</script>

<style>
#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
  padding: 2rem;
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
}
</style>
