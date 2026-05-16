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

  namespace Role {
    interface Row {
      id: number
      code: string
      name: string
      description: string
      userCount: number
      enabled: boolean
      builtin: boolean
      createdAt: string
    }

    interface ListResponse {
      total: number
      list: Row[]
    }

    interface CreatePayload {
      code: string
      name: string
      description: string
      enabled: boolean
    }

    type UpdatePayload = Omit<CreatePayload, 'code'>
  }

  namespace AuditLog {
    type Action =
      | 'login'
      | 'logout'
      | 'create_role'
      | 'update_role'
      | 'delete_role'
      | 'view_list'
      | 'export'

    type Status = 'success' | 'failed'

    interface Row {
      id: number
      operator: string
      operatorRole: App.UserRole
      action: Action
      target: string
      ip: string
      status: Status
      durationMs: number
      createdAt: string
    }

    interface Detail extends Row {
      userAgent: string
      requestPayload: Record<string, unknown> | null
      responseSnippet: string
    }

    interface ListResponse {
      total: number
      list: Row[]
    }
  }
}
