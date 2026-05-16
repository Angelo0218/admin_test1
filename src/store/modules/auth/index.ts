import { computed, reactive, ref } from 'vue'
import { defineStore } from 'pinia'
import { ElMessage } from 'element-plus'
import { router } from '@/router'
import { fetchLogin, fetchUserInfo } from '@/api/auth'
import { clearToken, getToken, setToken } from '@/utils/auth'
import { SetupStoreId } from '@/enum'
import { $t } from '@/locales'

function emptyUserInfo(): App.UserInfo {
  return { userId: '', userName: '', role: 'user' }
}

export const useAuthStore = defineStore(SetupStoreId.Auth, () => {
  const token = ref(getToken())
  const userInfo = reactive<App.UserInfo>(emptyUserInfo())
  const loginLoading = ref(false)

  const isLogin = computed(() => Boolean(token.value))

  async function login(username: string, password: string, redirect?: string) {
    loginLoading.value = true
    try {
      const data = await fetchLogin(username, password)
      setToken(data.token)
      token.value = data.token
      Object.assign(userInfo, data.userInfo)

      ElMessage.success($t('page.login.success', { name: data.userInfo.userName }))
      await router.push(redirect || '/')
      return true
    } catch {
      ElMessage.error($t('page.login.invalid'))
      return false
    } finally {
      loginLoading.value = false
    }
  }

  async function resetStore() {
    clearToken()
    token.value = ''
    Object.assign(userInfo, emptyUserInfo())
    await router.push('/login')
  }

  async function initUserInfo() {
    const cached = getToken()
    if (!cached) return
    token.value = cached
    // 401 is handled by the alova interceptor (resetStore + redirect).
    // Other errors leave the cached token in place so user can retry.
    const info = await fetchUserInfo().catch(() => null)
    if (info) Object.assign(userInfo, info)
  }

  return {
    token,
    userInfo,
    loginLoading,
    isLogin,
    login,
    resetStore,
    initUserInfo
  }
})
