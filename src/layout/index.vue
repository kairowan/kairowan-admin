<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useSettingsStore } from '@/stores/settings'
import TagsView from './components/TagsView.vue'
import Breadcrumb from './components/Breadcrumb.vue'
import NavbarTools from './components/NavbarTools.vue'

const router = useRouter()
const authStore = useAuthStore()
const settingsStore = useSettingsStore()

const sidebarOpened = computed(() => settingsStore.sidebarOpened)

const handleCommand = (command: string) => {
  if (command === 'logout') {
    handleLogout()
  } else if (command === 'profile') {
    router.push('/profile')
  }
}

const handleLogout = async () => {
  await authStore.logout()
  router.push('/login')
}
</script>

<template>
  <div class="app-wrapper">
    <!-- 侧边栏 -->
    <div :class="['sidebar-container', { 'sidebar-collapsed': !sidebarOpened }]">
      <div class="sidebar-logo">
        <h1>Kairowan Admin</h1>
      </div>
      <el-menu
        :default-active="$route.path"
        :collapse="!sidebarOpened"
        :unique-opened="true"
        router
      >
        <el-menu-item index="/dashboard">
          <el-icon><HomeFilled /></el-icon>
          <template #title>首页</template>
        </el-menu-item>

        <el-sub-menu index="/system">
          <template #title>
            <el-icon><Setting /></el-icon>
            <span>系统管理</span>
          </template>
          <el-menu-item index="/system/user">用户管理</el-menu-item>
          <el-menu-item index="/system/role">角色管理</el-menu-item>
          <el-menu-item index="/system/menu">菜单管理</el-menu-item>
          <el-menu-item index="/system/dept">部门管理</el-menu-item>
        </el-sub-menu>

        <el-sub-menu index="/monitor">
          <template #title>
            <el-icon><Monitor /></el-icon>
            <span>系统监控</span>
          </template>
          <el-menu-item index="/monitor/online">在线用户</el-menu-item>
          <el-menu-item index="/monitor/job">定时任务</el-menu-item>
          <el-menu-item index="/monitor/operlog">操作日志</el-menu-item>
        </el-sub-menu>

        <el-sub-menu index="/tool">
          <template #title>
            <el-icon><Box /></el-icon>
            <span>系统工具</span>
          </template>
          <el-menu-item index="/tool/file">文件管理</el-menu-item>
          <el-menu-item index="/tool/analysis">数据分析</el-menu-item>
        </el-sub-menu>
      </el-menu>
    </div>

    <!-- 主容器 -->
    <div class="main-container">
      <!-- 顶部导航栏 -->
      <div class="navbar">
        <div class="navbar-left">
          <el-icon class="hamburger" @click="settingsStore.toggleSidebar">
            <Expand v-if="!sidebarOpened" />
            <Fold v-else />
          </el-icon>
          <Breadcrumb />
        </div>

        <div class="navbar-right">
          <NavbarTools />
          <el-dropdown @command="handleCommand">
            <div class="user-info">
              <el-avatar :size="32" :src="authStore.avatar">
                {{ authStore.nickName?.charAt(0) }}
              </el-avatar>
              <span class="user-name">{{ authStore.nickName || authStore.userName }}</span>
            </div>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="profile">个人中心</el-dropdown-item>
                <el-dropdown-item divided command="logout">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>

      <!-- 标签页导航 -->
      <TagsView />

      <!-- 主内容区 -->
      <div class="app-main">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.app-wrapper {
  display: flex;
  width: 100%;
  height: 100%;
}

.sidebar-container {
  width: 210px;
  height: 100%;
  background: linear-gradient(180deg, #1a1f2e 0%, #252d3d 100%);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.15);
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    width: 1px;
    height: 100%;
    background: linear-gradient(180deg, rgba(64, 158, 255, 0.3) 0%, rgba(64, 158, 255, 0) 100%);
  }

  &.sidebar-collapsed {
    width: 64px;

    .sidebar-logo h1 {
      opacity: 0;
      transform: scale(0.8);
    }
  }

  .sidebar-logo {
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    position: relative;
    overflow: hidden;

    &::before {
      content: '';
      position: absolute;
      top: -50%;
      left: -50%;
      width: 200%;
      height: 200%;
      background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
      animation: pulse 3s ease-in-out infinite;
    }

    h1 {
      color: #fff;
      font-size: 22px;
      font-weight: 700;
      margin: 0;
      letter-spacing: 1px;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      position: relative;
      z-index: 1;
    }
  }

  :deep(.el-menu) {
    border-right: none;
    background-color: transparent;
    padding: 8px 0;

    .el-menu-item,
    .el-sub-menu__title {
      color: #b8c7d9;
      height: 48px;
      line-height: 48px;
      margin: 4px 8px;
      border-radius: 8px;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      position: relative;
      overflow: hidden;

      &::before {
        content: '';
        position: absolute;
        left: 0;
        top: 50%;
        transform: translateY(-50%);
        width: 3px;
        height: 0;
        background: linear-gradient(180deg, #409eff 0%, #66b1ff 100%);
        border-radius: 0 2px 2px 0;
        transition: height 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      }

      .el-icon {
        font-size: 18px;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      }

      &:hover {
        background: rgba(64, 158, 255, 0.1);
        color: #fff;
        transform: translateX(2px);

        &::before {
          height: 60%;
        }

        .el-icon {
          transform: scale(1.1);
          color: #409eff;
        }
      }

      &.is-active {
        background: linear-gradient(90deg, rgba(64, 158, 255, 0.2) 0%, rgba(64, 158, 255, 0.05) 100%);
        color: #fff;
        font-weight: 600;

        &::before {
          height: 80%;
        }

        .el-icon {
          color: #409eff;
        }
      }
    }

    .el-sub-menu {
      .el-menu {
        background-color: rgba(0, 0, 0, 0.1);
        padding: 4px 0;
      }

      .el-menu-item {
        background-color: transparent;
        margin: 2px 8px 2px 16px;
        padding-left: 48px !important;
        height: 44px;
        line-height: 44px;

        &::before {
          left: 8px;
        }

        &:hover {
          background: rgba(64, 158, 255, 0.08);
        }

        &.is-active {
          background: linear-gradient(90deg, rgba(64, 158, 255, 0.15) 0%, rgba(64, 158, 255, 0.03) 100%);
        }
      }
    }
  }
}

@keyframes pulse {
  0%, 100% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 0.5;
  }
  50% {
    transform: translate(-50%, -50%) scale(1.1);
    opacity: 0.8;
  }
}

.main-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
  background-color: #f0f2f5;
}

.navbar {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  position: relative;
  z-index: 10;

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent 0%, rgba(64, 158, 255, 0.3) 50%, transparent 100%);
  }

  .navbar-left {
    display: flex;
    align-items: center;
    gap: 16px;

    .hamburger {
      font-size: 22px;
      cursor: pointer;
      color: #606266;
      padding: 8px;
      border-radius: 8px;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      background: transparent;

      &:hover {
        background: rgba(64, 158, 255, 0.1);
        color: #409eff;
        transform: rotate(180deg);
      }

      &:active {
        transform: rotate(180deg) scale(0.95);
      }
    }
  }

  .navbar-right {
    display: flex;
    align-items: center;
    gap: 16px;

    .user-info {
      display: flex;
      align-items: center;
      gap: 10px;
      cursor: pointer;
      padding: 6px 12px;
      border-radius: 20px;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

      &:hover {
        background: rgba(64, 158, 255, 0.08);

        .user-name {
          color: #409eff;
        }
      }

      .el-avatar {
        border: 2px solid #fff;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      }

      .user-name {
        font-size: 14px;
        color: #303133;
        font-weight: 500;
        transition: color 0.3s;
      }
    }
  }
}

.app-main {
  flex: 1;
  padding: 20px;
  background: linear-gradient(135deg, #f0f2f5 0%, #e8eaf0 100%);
  overflow-y: auto;
  position: relative;

  &::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.05);
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.15);
    border-radius: 4px;
    transition: background 0.3s;

    &:hover {
      background: rgba(0, 0, 0, 0.25);
    }
  }
}

// 页面过渡动画
.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.fade-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
