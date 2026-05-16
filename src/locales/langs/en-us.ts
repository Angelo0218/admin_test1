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
    brand: 'Admin'
  },
  route: {
    login: 'Sign in',
    dashboard: 'Dashboard',
    list: 'List',
    admin: 'Admin',
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
      hint: 'Sign in as admin to see the "Admin" menu; the user account will not see it.'
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
    admin: {
      title: 'Admin Console',
      subtitle: 'This page is only visible to admin users',
      sections: {
        roles: 'Role Management',
        permissions: 'Permission Settings',
        audit: 'Audit Logs'
      },
      roleDesc: 'Manage roles and their assigned permissions',
      permissionDesc: 'Assign feature permissions to each role',
      auditDesc: 'Review system operation logs'
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
