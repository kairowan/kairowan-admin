import type { RouteRecordRaw } from 'vue-router'
import Layout from '@/layout/index.vue'

/**
 * 静态路由
 * 所有用户都可以访问的路由
 */
export const constantRoutes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/index.vue'),
    meta: { hidden: true, title: '登录' }
  },
  {
    path: '/404',
    name: '404',
    component: () => import('@/views/error/404.vue'),
    meta: { hidden: true, title: '404' }
  },
  {
    path: '/401',
    name: '401',
    component: () => import('@/views/error/401.vue'),
    meta: { hidden: true, title: '401' }
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/dashboard/index.vue'),
        meta: { title: '首页', icon: 'HomeFilled', affix: true }
      },
      {
        path: 'profile',
        name: 'Profile',
        component: () => import('@/views/profile/index.vue'),
        meta: { title: '个人中心', icon: 'User', hidden: true }
      },
      {
        path: 'notification',
        name: 'Notification',
        component: () => import('@/views/notification/index.vue'),
        meta: { title: '通知中心', icon: 'Bell', hidden: true }
      }
    ]
  }
]

/**
 * 动态路由
 * 需要根据用户权限动态加载的路由
 */
export const asyncRoutes: RouteRecordRaw[] = [
  {
    path: '/system',
    component: Layout,
    redirect: '/system/user',
    meta: { title: '系统管理', icon: 'Setting' },
    children: [
      {
        path: 'user',
        name: 'User',
        component: () => import('@/views/system/user/index.vue'),
        meta: { title: '用户管理', icon: 'User', permission: 'system:user:list' }
      },
      {
        path: 'role',
        name: 'Role',
        component: () => import('@/views/system/role/index.vue'),
        meta: { title: '角色管理', icon: 'UserFilled', permission: 'system:role:list' }
      },
      {
        path: 'menu',
        name: 'Menu',
        component: () => import('@/views/system/menu/index.vue'),
        meta: { title: '菜单管理', icon: 'Menu', permission: 'system:menu:list' }
      },
      {
        path: 'dept',
        name: 'Dept',
        component: () => import('@/views/system/dept/index.vue'),
        meta: { title: '部门管理', icon: 'OfficeBuilding', permission: 'system:dept:list' }
      },
      {
        path: 'post',
        name: 'Post',
        component: () => import('@/views/system/post/index.vue'),
        meta: { title: '岗位管理', icon: 'Briefcase', permission: 'system:post:list' }
      },
      {
        path: 'dict',
        name: 'Dict',
        component: () => import('@/views/system/dict/index.vue'),
        meta: { title: '字典管理', icon: 'Collection', permission: 'system:dict:list' }
      },
      {
        path: 'config',
        name: 'Config',
        component: () => import('@/views/system/config/index.vue'),
        meta: { title: '参数设置', icon: 'Tools', permission: 'system:config:list' }
      }
    ]
  },
  {
    path: '/monitor',
    component: Layout,
    redirect: '/monitor/online',
    meta: { title: '系统监控', icon: 'Monitor' },
    children: [
      {
        path: 'online',
        name: 'Online',
        component: () => import('@/views/monitor/online/index.vue'),
        meta: { title: '在线用户', icon: 'Connection', permission: 'monitor:online:list' }
      },
      {
        path: 'job',
        name: 'Job',
        component: () => import('@/views/monitor/job/index.vue'),
        meta: { title: '定时任务', icon: 'Timer', permission: 'monitor:job:list' }
      },
      {
        path: 'operlog',
        name: 'Operlog',
        component: () => import('@/views/monitor/operlog/index.vue'),
        meta: { title: '操作日志', icon: 'Document', permission: 'monitor:operlog:list' }
      },
      {
        path: 'loginlog',
        name: 'Loginlog',
        component: () => import('@/views/monitor/loginlog/index.vue'),
        meta: { title: '登录日志', icon: 'Key', permission: 'monitor:loginlog:list' }
      },
      {
        path: 'server',
        name: 'Server',
        component: () => import('@/views/monitor/server/index.vue'),
        meta: { title: '服务监控', icon: 'Cpu', permission: 'monitor:server:list' }
      }
    ]
  },
  {
    path: '/tool',
    component: Layout,
    redirect: '/tool/generator',
    meta: { title: '系统工具', icon: 'Box' },
    children: [
      {
        path: 'generator',
        name: 'Generator',
        component: () => import('@/views/tool/generator/index.vue'),
        meta: { title: '代码生成', icon: 'DocumentAdd', permission: 'tool:gen:list' }
      },
      {
        path: 'file',
        name: 'FileManage',
        component: () => import('@/views/file/index.vue'),
        meta: { title: '文件管理', icon: 'Folder', permission: 'tool:file:list' }
      },
      {
        path: 'analysis',
        name: 'DataAnalysis',
        component: () => import('@/views/analysis/index.vue'),
        meta: { title: '数据分析', icon: 'DataAnalysis', permission: 'tool:analysis:list' }
      }
    ]
  }
]
