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
    brand: 'Admin',
    all: '全部',
    detail: '詳情',
    operationSuccess: '操作成功'
  },
  route: {
    login: '登入',
    dashboard: '儀表板',
    list: '列表',
    roleMgmt: '角色管理',
    auditLog: '稽核紀錄',
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
      hint: '使用 admin 帳號可看到「角色管理」與「稽核紀錄」；user 帳號則看不到。'
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
    roleMgmt: {
      title: '角色管理',
      subtitle: '管理系統內的角色與其對應權限',
      keyword: '關鍵字',
      keywordPlaceholder: '搜尋代碼 / 名稱',
      addRole: '新增角色',
      editRole: '編輯角色',
      column: {
        id: '#',
        code: '代碼',
        name: '名稱',
        description: '描述',
        userCount: '使用者數',
        status: '狀態',
        builtin: '內建',
        createdAt: '建立時間',
        action: '操作'
      },
      status: {
        enabled: '啟用',
        disabled: '停用'
      },
      form: {
        code: '代碼',
        codePlaceholder: '英數加底線，3-20 字',
        codeHint: '建立後不可修改',
        name: '名稱',
        namePlaceholder: '顯示名稱，1-30 字',
        description: '描述',
        descriptionPlaceholder: '簡述此角色的用途',
        enabled: '啟用'
      },
      validation: {
        codeRequired: '請輸入代碼',
        codeFormat: '代碼僅允許英數與底線，長度 3-20',
        codeDuplicated: '代碼已存在',
        nameRequired: '請輸入名稱',
        nameLength: '名稱長度 1-30 字',
        descriptionLength: '描述不可超過 200 字'
      },
      deleteConfirm: '確定要刪除角色「{name}」嗎？',
      deleteBuiltinError: '內建角色「{name}」不可刪除',
      createSuccess: '已新增角色「{name}」',
      updateSuccess: '已更新角色「{name}」',
      deleteSuccess: '已刪除角色「{name}」'
    },
    auditLog: {
      title: '稽核紀錄',
      subtitle: '檢視系統操作紀錄',
      filter: {
        action: '動作',
        actionPlaceholder: '全部動作',
        operator: '操作者',
        operatorPlaceholder: '使用者名稱',
        status: '狀態',
        statusPlaceholder: '全部狀態',
        dateRange: '日期區間',
        dateStart: '開始日期',
        dateEnd: '結束日期'
      },
      column: {
        id: '#',
        createdAt: '時間',
        operator: '操作者',
        action: '動作',
        target: '目標',
        ip: 'IP',
        status: '狀態',
        actions: '操作'
      },
      status: {
        success: '成功',
        failed: '失敗'
      },
      action: {
        login: '登入',
        logout: '登出',
        create_role: '建立角色',
        update_role: '更新角色',
        delete_role: '刪除角色',
        view_list: '檢視列表',
        export: '匯出'
      },
      detail: {
        title: '稽核紀錄詳情',
        userAgent: '使用者代理',
        duration: '耗時',
        durationUnit: '毫秒',
        request: '請求內容',
        response: '回應內容',
        emptyRequest: '無請求內容'
      },
      detailError: '無法載入詳情'
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
