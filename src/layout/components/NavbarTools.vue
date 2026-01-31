<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { FullScreen, Bell, Sunny, Moon } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { useSettingsStore } from '@/stores/settings'

const router = useRouter()
const settingsStore = useSettingsStore()
const isFullscreen = ref(false)
const notificationCount = ref(3)

// 主题切换
const isDark = computed(() => settingsStore.theme === 'dark')

const toggleTheme = () => {
  const newTheme = isDark.value ? 'light' : 'dark'
  settingsStore.setTheme(newTheme)

  // 切换 HTML 的 class
  if (newTheme === 'dark') {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }

  ElMessage.success(`已切换到${newTheme === 'dark' ? '暗色' : '亮色'}主题`)
}

// 全屏切换
const toggleFullscreen = () => {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen()
    isFullscreen.value = true
    ElMessage.success('已进入全屏模式')
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen()
      isFullscreen.value = false
      ElMessage.success('已退出全屏模式')
    }
  }
}

// 通知中心
const handleNotification = () => {
  router.push('/notification')
}

// 监听全屏变化
document.addEventListener('fullscreenchange', () => {
  isFullscreen.value = !!document.fullscreenElement
})
</script>

<template>
  <div class="navbar-tools">
    <!-- 主题切换 -->
    <el-tooltip :content="isDark ? '切换到亮色模式' : '切换到暗色模式'" placement="bottom">
      <div class="tool-item" @click="toggleTheme">
        <el-icon :size="18">
          <Sunny v-if="isDark" />
          <Moon v-else />
        </el-icon>
      </div>
    </el-tooltip>

    <!-- 全屏 -->
    <el-tooltip :content="isFullscreen ? '退出全屏' : '全屏显示'" placement="bottom">
      <div class="tool-item" @click="toggleFullscreen">
        <el-icon :size="18">
          <FullScreen />
        </el-icon>
      </div>
    </el-tooltip>

    <!-- 通知 -->
    <el-tooltip content="通知中心" placement="bottom">
      <el-badge :value="notificationCount" :max="99" class="tool-item-badge">
        <div class="tool-item" @click="handleNotification">
          <el-icon :size="18">
            <Bell />
          </el-icon>
        </div>
      </el-badge>
    </el-tooltip>
  </div>
</template>

<style scoped lang="scss">
.navbar-tools {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-right: 16px;

  .tool-item-badge {
    :deep(.el-badge__content) {
      border: 2px solid #fff;
    }
  }

  .tool-item {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    border-radius: 8px;
    cursor: pointer;
    color: #606266;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;

    &::before {
      content: '';
      position: absolute;
      inset: 0;
      border-radius: 8px;
      background: transparent;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    &:hover {
      color: #409eff;
      transform: translateY(-2px);

      &::before {
        background: rgba(64, 158, 255, 0.1);
      }
    }

    &:active {
      transform: translateY(0) scale(0.95);
    }

    .el-icon {
      position: relative;
      z-index: 1;
    }
  }
}
</style>
