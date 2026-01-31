import { defineStore } from 'pinia'

interface SettingsState {
  sidebarOpened: boolean
  device: 'desktop' | 'mobile'
  size: 'default' | 'large' | 'small'
  theme: 'light' | 'dark'
  showTagsView: boolean
  fixedHeader: boolean
  sidebarLogo: boolean
}

export const useSettingsStore = defineStore('settings', {
  state: (): SettingsState => ({
    sidebarOpened: true,
    device: 'desktop',
    size: 'default',
    theme: 'light',
    showTagsView: true,
    fixedHeader: true,
    sidebarLogo: true
  }),

  actions: {
    // 初始化主题
    initTheme() {
      const theme = this.theme
      if (theme === 'dark') {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
    },

    toggleSidebar() {
      this.sidebarOpened = !this.sidebarOpened
    },

    closeSidebar() {
      this.sidebarOpened = false
    },

    openSidebar() {
      this.sidebarOpened = true
    },

    setDevice(device: 'desktop' | 'mobile') {
      this.device = device
    },

    setSize(size: 'default' | 'large' | 'small') {
      this.size = size
    },

    setTheme(theme: 'light' | 'dark') {
      this.theme = theme
      if (theme === 'dark') {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
    },

    toggleTheme() {
      this.setTheme(this.theme === 'light' ? 'dark' : 'light')
    },

    setShowTagsView(show: boolean) {
      this.showTagsView = show
    },

    setFixedHeader(fixed: boolean) {
      this.fixedHeader = fixed
    },

    setSidebarLogo(show: boolean) {
      this.sidebarLogo = show
    }
  },

  persist: true
})
