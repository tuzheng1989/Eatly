<template>
  <n-config-provider :theme-overrides="themeOverrides">
    <GlobalMessageProvider>
      <n-loading-bar-provider>
        <AppHeader />
        <main class="main-content">
          <router-view />
        </main>
      </n-loading-bar-provider>
    </GlobalMessageProvider>
  </n-config-provider>
</template>

<script setup lang="ts">
import { NConfigProvider, NLoadingBarProvider } from 'naive-ui'
import AppHeader from '@/components/common/AppHeader.vue'
import GlobalMessageProvider from '@/components/common/GlobalMessageProvider.vue'

const themeOverrides = {
  common: {
    primaryColor: '#42b983',
    primaryColorHover: '#33a06f',
    primaryColorPressed: '#2c8a60'
  }
}
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
