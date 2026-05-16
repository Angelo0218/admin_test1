import { createApp } from 'vue'
import App from './App.vue'
import { setupStore, useAuthStore } from './store'
import { getLocale, setupI18n } from './locales'
import { setupRouter } from './router'
import './styles/index.scss'

async function bootstrap() {
  document.documentElement.setAttribute('lang', getLocale())

  const app = createApp(App)

  setupStore(app)
  setupI18n(app)

  await useAuthStore().initUserInfo()

  await setupRouter(app)

  app.mount('#app')
}

bootstrap()
