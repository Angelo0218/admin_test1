import type { RouteRecordRaw } from 'vue-router'

declare module 'vue-router' {
  interface RouteMeta {
    title?: string
    icon?: string
    roles?: App.UserRole[]
    constant?: boolean
    hideInMenu?: boolean
  }
}

export const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/_builtin/login/index.vue'),
    meta: { title: 'route.login', constant: true, hideInMenu: true }
  },
  {
    path: '/403',
    name: 'no-permission',
    component: () => import('@/views/_builtin/403/index.vue'),
    meta: { title: 'route.noPermission', constant: true, hideInMenu: true }
  },
  {
    path: '/',
    component: () => import('@/layouts/BaseLayout.vue'),
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'dashboard',
        component: () => import('@/views/dashboard/index.vue'),
        meta: { title: 'route.dashboard', icon: 'mdi:view-dashboard' }
      },
      {
        path: 'list',
        name: 'list',
        component: () => import('@/views/list/index.vue'),
        meta: { title: 'route.list', icon: 'mdi:table' }
      },
      {
        path: 'role-mgmt',
        name: 'role-mgmt',
        component: () => import('@/views/role-mgmt/index.vue'),
        meta: { title: 'route.roleMgmt', icon: 'mdi:account-cog', roles: ['admin'] }
      },
      {
        path: 'audit-log',
        name: 'audit-log',
        component: () => import('@/views/audit-log/index.vue'),
        meta: { title: 'route.auditLog', icon: 'mdi:clipboard-text-clock', roles: ['admin'] }
      }
    ]
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/views/_builtin/404/index.vue'),
    meta: { title: 'route.notFound', constant: true, hideInMenu: true }
  }
]
