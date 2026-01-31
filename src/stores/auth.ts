import { defineStore } from 'pinia'
import { login, logout, getUserInfo, getRouters } from '@/api/auth'
import type { LoginParams, UserInfo, RouterMenu } from '@/types/api'
import Cookies from 'js-cookie'

const TOKEN_KEY = 'kairowan_token'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: Cookies.get(TOKEN_KEY) || '',
    userInfo: null as UserInfo | null,
    permissions: [] as string[],
    roles: [] as string[],
    routers: [] as RouterMenu[]
  }),

  getters: {
    isLoggedIn: (state) => !!state.token,
    userName: (state) => state.userInfo?.userName || '',
    nickName: (state) => state.userInfo?.nickName || '',
    avatar: (state) => state.userInfo?.avatar || '',
    hasPermission: (state) => {
      return (permission: string) => {
        return state.permissions.includes(permission) || state.permissions.includes('*:*:*')
      }
    },
    hasRole: (state) => {
      return (role: string) => {
        return state.roles.includes(role) || state.roles.includes('admin')
      }
    }
  },

  actions: {
    /**
     * 登录
     */
    async login(loginForm: LoginParams) {
      try {
        const data = await login(loginForm)
        this.token = (data as any).token
        Cookies.set(TOKEN_KEY, (data as any).token, { expires: 7 })
      } catch (error) {
        throw error
      }
    },

    /**
     * 获取用户信息
     */
    async getUserInfo() {
      try {
        const data = await getUserInfo() as any
        this.userInfo = data
        this.permissions = data.permissions
        this.roles = data.roles
      } catch (error) {
        throw error
      }
    },

    /**
     * 获取路由菜单
     */
    async getRouters() {
      try {
        const data = await getRouters() as any
        this.routers = data
      } catch (error) {
        throw error
      }
    },

    /**
     * 登出
     */
    async logout() {
      try {
        await logout()
      } catch (error) {
        console.error('Logout error:', error)
      } finally {
        this.token = ''
        this.userInfo = null
        this.permissions = []
        this.roles = []
        this.routers = []
        Cookies.remove(TOKEN_KEY)
      }
    },

    /**
     * 重置状态
     */
    reset() {
      this.token = ''
      this.userInfo = null
      this.permissions = []
      this.roles = []
      this.routers = []
      Cookies.remove(TOKEN_KEY)
    }
  }
})
