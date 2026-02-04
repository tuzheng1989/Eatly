import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { useAppStore } from './stores'
import { useSchemeStore } from './stores'

// Import UnoCSS
import 'virtual:uno.css'

const app = createApp(App)

app.use(createPinia())
app.use(router)

// Initialize app
async function initializeApp() {
  const appStore = useAppStore()
  appStore.loadSettings()

  // Initialize scheme management
  const schemeStore = useSchemeStore()
  await schemeStore.initializeScheme()
}

// Mount app after initialization
initializeApp().then(() => {
  app.mount('#app')
})
