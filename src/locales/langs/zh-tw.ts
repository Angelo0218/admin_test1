export default {
  common: {
    confirm: '確認',
    cancel: '取消',
    submit: '送出',
    search: '搜尋',
    reset: '重置',
    add: '新增',
    edit: '編輯',
    view: '檢視',
    delete: '刪除',
    save: '儲存',
    refresh: '重新整理',
    apply: '套用',
    logout: '登出',
    logoutConfirm: '確定要登出嗎？',
    yes: '是',
    no: '否',
    success: '成功',
    failed: '失敗',
    loading: '載入中…',
    welcome: '歡迎',
    brand: 'Admin'
  },
  route: {
    login: '登入',
    dashboard: '儀表板',
    list: '列表',
    admin: '管理員介面',
    noPermission: '無權限',
    notFound: '頁面不存在'
  },
  layout: {
    fullScreen: '全螢幕',
    exitFullScreen: '退出全螢幕',
    lang: '語言',
    theme: '主題',
    themeLight: '淺色',
    themeDark: '深色',
    collapse: '收合選單',
    expand: '展開選單',
    profile: '個人資訊',
    role: '角色'
  },
  page: {
    login: {
      title: 'Admin 管理介面',
      subtitle: '請使用以下測試帳號登入',
      username: '帳號',
      usernamePlaceholder: '請輸入帳號',
      password: '密碼',
      passwordPlaceholder: '請輸入密碼',
      submit: '登入',
      submitting: '登入中…',
      success: '登入成功，歡迎 {name}',
      invalid: '帳號或密碼錯誤',
      testAccounts: '測試帳號',
      adminAccount: '管理員：admin / admin123',
      userAccount: '一般使用者：user / user123'
    },
    dashboard: {
      welcome: '歡迎回來，{name}',
      summary: '系統總覽',
      totalUsers: '使用者總數',
      todayLogins: '今日登入',
      activeSessions: '活躍工作階段',
      systemHealth: '系統健康度',
      yourRole: '您的角色',
      visibleMenus: '您可見的選單',
      hint: '使用 admin 帳號可看到「管理員介面」分頁；user 帳號則看不到。'
    },
    list: {
      title: '使用者列表',
      keyword: '關鍵字',
      keywordPlaceholder: '搜尋姓名 / Email',
      column: {
        id: '#',
        name: '姓名',
        role: '角色',
        email: 'Email',
        status: '狀態',
        createdAt: '建立時間',
        action: '操作'
      },
      status: {
        active: '啟用',
        inactive: '停用'
      },
      role: {
        admin: '管理員',
        user: '一般使用者'
      }
    },
    admin: {
      title: '管理員介面',
      subtitle: '此頁僅 admin 角色可見',
      sections: {
        roles: '角色管理',
        permissions: '權限設定',
        audit: '稽核紀錄'
      },
      roleDesc: '管理系統內的角色與其對應權限',
      permissionDesc: '指派功能權限給各角色',
      auditDesc: '檢視系統操作紀錄'
    },
    error: {
      e403Title: '403 無權限',
      e403Desc: '抱歉，您沒有存取此頁的權限。',
      e404Title: '404 找不到頁面',
      e404Desc: '抱歉，您訪問的頁面不存在。',
      backHome: '回首頁'
    }
  }
}
