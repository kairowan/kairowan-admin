import { ref, onMounted, onUnmounted } from 'vue'
import { useSettingsStore } from '@/stores/settings'

const WIDTH = 992 // 响应式断点

/**
 * 响应式布局相关的组合式函数
 */
export function useResponsive() {
  const settingsStore = useSettingsStore()
  const isMobile = ref(false)

  const handleResize = () => {
    const rect = document.body.getBoundingClientRect()
    isMobile.value = rect.width - 1 < WIDTH

    if (isMobile.value) {
      settingsStore.setDevice('mobile')
      settingsStore.closeSidebar()
    } else {
      settingsStore.setDevice('desktop')
    }
  }

  onMounted(() => {
    handleResize()
    window.addEventListener('resize', handleResize)
  })

  onUnmounted(() => {
    window.removeEventListener('resize', handleResize)
  })

  return {
    isMobile
  }
}
