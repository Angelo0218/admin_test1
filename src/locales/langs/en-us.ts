export default {
  common: {
    confirm: 'Confirm',
    cancel: 'Cancel',
    submit: 'Submit',
    search: 'Search',
    reset: 'Reset',
    add: 'Add',
    edit: 'Edit',
    view: 'View',
    delete: 'Delete',
    save: 'Save',
    refresh: 'Refresh',
    apply: 'Apply',
    logout: 'Logout',
    logoutConfirm: 'Are you sure you want to log out?',
    yes: 'Yes',
    no: 'No',
    success: 'Success',
    failed: 'Failed',
    loading: 'Loading…',
    welcome: 'Welcome',
    brand: 'Admin',
    all: 'All',
    detail: 'Detail',
    operationSuccess: 'Operation succeeded'
  },
  route: {
    login: 'Sign in',
    dashboard: 'Dashboard',
    list: 'List',
    roleMgmt: 'Role Management',
    auditLog: 'Audit Log',
    noPermission: 'No Permission',
    notFound: 'Not Found'
  },
  layout: {
    fullScreen: 'Full screen',
    exitFullScreen: 'Exit full screen',
    lang: 'Language',
    theme: 'Theme',
    themeLight: 'Light',
    themeDark: 'Dark',
    collapse: 'Collapse',
    expand: 'Expand',
    profile: 'Profile',
    role: 'Role'
  },
  page: {
    login: {
      title: 'Admin Console',
      subtitle: 'Sign in with one of the test accounts below',
      username: 'Username',
      usernamePlaceholder: 'Enter username',
      password: 'Password',
      passwordPlaceholder: 'Enter password',
      submit: 'Sign in',
      submitting: 'Signing in…',
      success: 'Signed in, welcome {name}',
      invalid: 'Invalid username or password',
      testAccounts: 'Test accounts',
      adminAccount: 'Admin: admin / admin123',
      userAccount: 'User: user / user123'
    },
    dashboard: {
      welcome: 'Welcome back, {name}',
      summary: 'Overview',
      totalUsers: 'Total Users',
      todayLogins: 'Logins Today',
      activeSessions: 'Active Sessions',
      systemHealth: 'System Health',
      yourRole: 'Your Role',
      visibleMenus: 'Menus you can see',
      hint: 'Sign in as admin to see Role Management and Audit Log; the user account cannot.'
    },
    list: {
      title: 'User List',
      keyword: 'Keyword',
      keywordPlaceholder: 'Search name or email',
      column: {
        id: '#',
        name: 'Name',
        role: 'Role',
        email: 'Email',
        status: 'Status',
        createdAt: 'Created At',
        action: 'Action'
      },
      status: {
        active: 'Active',
        inactive: 'Inactive'
      },
      role: {
        admin: 'Admin',
        user: 'User'
      }
    },
    roleMgmt: {
      title: 'Role Management',
      subtitle: 'Manage system roles and their permissions',
      keyword: 'Keyword',
      keywordPlaceholder: 'Search code or name',
      addRole: 'Add Role',
      editRole: 'Edit Role',
      column: {
        id: '#',
        code: 'Code',
        name: 'Name',
        description: 'Description',
        userCount: 'Users',
        status: 'Status',
        builtin: 'Built-in',
        createdAt: 'Created At',
        action: 'Action'
      },
      status: {
        enabled: 'Enabled',
        disabled: 'Disabled'
      },
      form: {
        code: 'Code',
        codePlaceholder: 'Alphanumeric and underscore, 3-20 chars',
        codeHint: 'Cannot be modified after creation',
        name: 'Name',
        namePlaceholder: 'Display name, 1-30 chars',
        description: 'Description',
        descriptionPlaceholder: 'Briefly describe this role',
        enabled: 'Enabled'
      },
      validation: {
        codeRequired: 'Please enter the code',
        codeFormat: 'Code allows alphanumeric and underscore, length 3-20',
        codeDuplicated: 'Code already exists',
        nameRequired: 'Please enter the name',
        nameLength: 'Name length should be 1-30 chars',
        descriptionLength: 'Description must not exceed 200 chars'
      },
      deleteConfirm: 'Delete role "{name}"?',
      deleteBuiltinError: 'Built-in role "{name}" cannot be deleted',
      createSuccess: 'Role "{name}" created',
      updateSuccess: 'Role "{name}" updated',
      deleteSuccess: 'Role "{name}" deleted'
    },
    auditLog: {
      title: 'Audit Log',
      subtitle: 'Review system operation history',
      filter: {
        action: 'Action',
        actionPlaceholder: 'All actions',
        operator: 'Operator',
        operatorPlaceholder: 'User name',
        status: 'Status',
        statusPlaceholder: 'All statuses',
        dateRange: 'Date range',
        dateStart: 'Start date',
        dateEnd: 'End date'
      },
      column: {
        id: '#',
        createdAt: 'Time',
        operator: 'Operator',
        action: 'Action',
        target: 'Target',
        ip: 'IP',
        status: 'Status',
        actions: 'Actions'
      },
      status: {
        success: 'Success',
        failed: 'Failed'
      },
      action: {
        login: 'Sign in',
        logout: 'Sign out',
        create_role: 'Create role',
        update_role: 'Update role',
        delete_role: 'Delete role',
        view_list: 'View list',
        export: 'Export'
      },
      detail: {
        title: 'Audit Log Detail',
        userAgent: 'User-Agent',
        duration: 'Duration',
        durationUnit: 'ms',
        request: 'Request payload',
        response: 'Response',
        emptyRequest: 'No request payload'
      },
      detailError: 'Failed to load detail'
    },
    error: {
      e403Title: '403 No Permission',
      e403Desc: 'Sorry, you do not have permission to access this page.',
      e404Title: '404 Not Found',
      e404Desc: 'Sorry, the page you visited does not exist.',
      backHome: 'Back home'
    }
  }
}
