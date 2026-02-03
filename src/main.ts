import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { useAppStore } from './stores'

// Import UnoCSS
import 'virtual:uno.css'

const app = createApp(App)

app.use(createPinia())
app.use(router)

// Initialize app
const appStore = useAppStore()
appStore.loadSettings()

// Mount app and expose message API
const instance = app.mount('#app')

// Expose message API globally
Object.defineProperty(window, '$message', {
  get() {
    return instance.$message
  }
})
