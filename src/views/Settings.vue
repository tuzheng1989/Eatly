<template>
  <div class="settings">
    <h1>设置 ⚙️</h1>
    <p>Settings page loaded successfully!</p>
    <p>Storage Mode: {{ storageMode }}</p>
    <p>API URL: {{ apiUrl }}</p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const storageMode = computed(() => import.meta.env.VITE_STORAGE_MODE || 'local')
const apiUrl = computed(() => import.meta.env.VITE_API_URL || 'http://localhost:4000/api')
</script>

<style scoped>
.settings {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}
</style>
