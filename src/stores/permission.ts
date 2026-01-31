import { defineStore } from 'pinia'
import type { RouteRecordRaw } from 'vue-router'
import { constantRoutes } from '@/router'
import Layout from '@/layout/index.vue'

/**
 * 动态路由转换
 */
function convertRoutes(routes: any[]): RouteRecordRaw[] {
  const result: RouteRecordRaw[] = []

  routes.forEach((route) => {
    const tmp: RouteRecordRaw = {
      path: route.path,
      name: route.name,
      component: route.component === 'Layout' ? Layout : loadView(route.component),
      meta: route.meta || {},
      children: route.children ? convertRoutes(route.children) : []
    }

    if (route.redirect) {
      tmp.redirect = route.redirect
    }

    result.push(tmp)
  })

  return result
}

/**
 * 动态加载组件
 */
function loadView(view: string) {
  return () => import(`@/views/${view}.vue`)
}

export const usePermissionStore = defineStore('permission', {
  state: () => ({
    routes: [] as RouteRecordRaw[],
    addRoutes: [] as RouteRecordRaw[],
    isRoutesGenerated: false
  }),

  getters: {
    allRoutes: (state) => constantRoutes.concat(state.addRoutes)
  },

  actions: {
    /**
     * 生成路由
     */
    generateRoutes(asyncRoutes: any[]) {
      const accessedRoutes = convertRoutes(asyncRoutes)
      this.addRoutes = accessedRoutes
      this.routes = constantRoutes.concat(accessedRoutes)
      this.isRoutesGenerated = true
      return accessedRoutes
    },

    /**
     * 重置路由
     */
    resetRoutes() {
      this.routes = []
      this.addRoutes = []
      this.isRoutesGenerated = false
    }
  },

  // 不持久化路由状态，每次刷新重新生成
  persist: false
})
