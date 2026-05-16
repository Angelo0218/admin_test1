import type { Router } from 'vue-router'
import { useAuthStore } from '@/store'
import { $t } from '@/locales'

export function setupRouterGuard(router: Router) {
  router.beforeEach((to) => {
    const auth = useAuthStore()

    if (to.meta.constant) {
      if (to.name === 'login' && auth.isLogin) return { path: '/' }
      return true
    }

    if (!auth.isLogin) {
      return { path: '/login', query: { redirect: to.fullPath } }
    }

    const required = to.meta.roles
    if (required && required.length > 0 && !required.includes(auth.userInfo.role)) {
      return { path: '/403' }
    }

    return true
  })

  router.afterEach((to) => {
    const base = import.meta.env.VITE_APP_TITLE || 'Admin'
    const titleKey = to.meta.title
    if (titleKey) {
      document.title = `${$t(titleKey)} · ${base}`
    } else {
      document.title = base
    }
  })
}
