declare namespace App {
  type UserRole = 'admin' | 'user'

  interface UserInfo {
    userId: string
    userName: string
    role: UserRole
  }

  namespace I18n {
    type LangType = 'zh-TW' | 'en-US'

    interface LangOption {
      key: LangType
      label: string
      flag: string
    }
  }

  namespace Theme {
    type ThemeMode = 'light' | 'dark' | 'auto'
  }
}

declare namespace Api {
  namespace Auth {
    interface LoginResponse {
      token: string
      userInfo: App.UserInfo
    }
  }

  namespace List {
    interface Row {
      id: number
      name: string
      role: App.UserRole
      email: string
      status: 'active' | 'inactive'
      createdAt: string
    }

    interface ListResponse {
      total: number
      list: Row[]
    }
  }
}
