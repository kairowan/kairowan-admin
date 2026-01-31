<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  Bell,
  Delete,
  Check,
  View,
  Setting,
  Message,
  Clock,
  Warning,
  CircleCheck,
  Document
} from '@element-plus/icons-vue'
import {
  getNotificationList,
  markNotificationRead,
  markNotificationsRead,
  markAllNotificationsRead,
  deleteNotification,
  deleteNotifications
} from '@/api/notification'

const activeTab = ref('all')
const selectedIds = ref<number[]>([])

const iconMap: Record<string, any> = {
  Setting,
  Message,
  Clock,
  Warning,
  CircleCheck,
  Document,
  Bell
}

const typeColorMap: Record<string, string> = {
  system: '#409eff',
  message: '#67c23a',
  todo: '#e6a23c'
}

const normalizeNotification = (item: any) => {
  const iconName = item.icon || ''
  return {
    ...item,
    icon: iconMap[iconName] || Bell,
    color: item.color || typeColorMap[item.type] || '#909399'
  }
}

// 通知数据
const notifications = ref<any[]>([])
const loading = ref(false)

const loadNotifications = async () => {
  loading.value = true
  try {
    const res = await getNotificationList()
    const rows = Array.isArray(res) ? res : res?.rows
    notifications.value = rows ? rows.map(normalizeNotification) : []
  } catch (error) {
    console.error('加载通知失败:', error)
    notifications.value = []
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadNotifications()
})

// 统计数据
const stats = computed(() => ({
  all: notifications.value.length,
  unread: notifications.value.filter(n => !n.read).length,
  system: notifications.value.filter(n => n.type === 'system').length,
  message: notifications.value.filter(n => n.type === 'message').length,
  todo: notifications.value.filter(n => n.type === 'todo').length
}))

// 过滤通知
const filteredNotifications = computed(() => {
  if (activeTab.value === 'all') {
    return notifications.value
  } else if (activeTab.value === 'unread') {
    return notifications.value.filter(n => !n.read)
  } else {
    return notifications.value.filter(n => n.type === activeTab.value)
  }
})

// 标记为已读
const markAsRead = async (id?: number) => {
  try {
    if (id) {
      await markNotificationRead(id)
      const notification = notifications.value.find(n => n.id === id)
      if (notification) {
        notification.read = true
      }
      ElMessage.success('已标记为已读')
    } else if (selectedIds.value.length > 0) {
      await markNotificationsRead(selectedIds.value)
      selectedIds.value.forEach(id => {
        const notification = notifications.value.find(n => n.id === id)
        if (notification) {
          notification.read = true
        }
      })
      selectedIds.value = []
      ElMessage.success('已标记为已读')
    }
  } catch (error) {
    ElMessage.error('操作失败')
  }
}

// 全部标记为已读
const markAllAsRead = () => {
  ElMessageBox.confirm('确认将所有通知标记为已读吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'info'
  }).then(async () => {
    try {
      await markAllNotificationsRead()
      notifications.value.forEach(n => {
        n.read = true
      })
      ElMessage.success('已全部标记为已读')
    } catch (error) {
      ElMessage.error('操作失败')
    }
  })
}

// 删除通知
const deleteNotificationHandler = (id?: number) => {
  ElMessageBox.confirm('确认删除该通知吗？', '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      if (id) {
        await deleteNotification(id)
        const index = notifications.value.findIndex(n => n.id === id)
        if (index > -1) {
          notifications.value.splice(index, 1)
        }
        ElMessage.success('删除成功')
      } else if (selectedIds.value.length > 0) {
        await deleteNotifications(selectedIds.value)
        notifications.value = notifications.value.filter(n => !selectedIds.value.includes(n.id))
        selectedIds.value = []
        ElMessage.success('删除成功')
      }
    } catch (error) {
      ElMessage.error('删除失败')
    }
  })
}

// 查看详情
const viewDetail = async (notification: any) => {
  if (!notification.read) {
    await markAsRead(notification.id)
  }
  ElMessageBox.alert(notification.content, notification.title, {
    confirmButtonText: '确定',
    type: 'info'
  })
}

// 全选/取消全选
const handleSelectAll = (val: boolean) => {
  if (val) {
    selectedIds.value = filteredNotifications.value.map(n => n.id)
  } else {
    selectedIds.value = []
  }
}

// 单选
const handleSelect = (id: number) => {
  const index = selectedIds.value.indexOf(id)
  if (index > -1) {
    selectedIds.value.splice(index, 1)
  } else {
    selectedIds.value.push(id)
  }
}

// 是否全选
const isAllSelected = computed(() => {
  return filteredNotifications.value.length > 0 &&
         selectedIds.value.length === filteredNotifications.value.length
})
</script>

<template>
  <div class="notification-container">
    <!-- 顶部统计卡片 -->
    <el-row :gutter="20" class="stats-row">
      <el-col :xs="12" :sm="6">
        <div class="stat-card" :class="{ active: activeTab === 'all' }" @click="activeTab = 'all'">
          <div class="stat-icon" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%)">
            <el-icon :size="24"><Bell /></el-icon>
          </div>
          <div class="stat-info">
            <div class="stat-value">{{ stats.all }}</div>
            <div class="stat-label">全部通知</div>
          </div>
        </div>
      </el-col>

      <el-col :xs="12" :sm="6">
        <div class="stat-card" :class="{ active: activeTab === 'unread' }" @click="activeTab = 'unread'">
          <div class="stat-icon" style="background: linear-gradient(135deg, #fa709a 0%, #fee140 100%)">
            <el-icon :size="24"><Bell /></el-icon>
          </div>
          <div class="stat-info">
            <div class="stat-value">{{ stats.unread }}</div>
            <div class="stat-label">未读通知</div>
          </div>
        </div>
      </el-col>

      <el-col :xs="12" :sm="6">
        <div class="stat-card" :class="{ active: activeTab === 'system' }" @click="activeTab = 'system'">
          <div class="stat-icon" style="background: linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)">
            <el-icon :size="24"><Bell /></el-icon>
          </div>
          <div class="stat-info">
            <div class="stat-value">{{ stats.system }}</div>
            <div class="stat-label">系统通知</div>
          </div>
        </div>
      </el-col>

      <el-col :xs="12" :sm="6">
        <div class="stat-card" :class="{ active: activeTab === 'message' }" @click="activeTab = 'message'">
          <div class="stat-icon" style="background: linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%)">
            <el-icon :size="24"><Bell /></el-icon>
          </div>
          <div class="stat-info">
            <div class="stat-value">{{ stats.message }}</div>
            <div class="stat-label">消息通知</div>
          </div>
        </div>
      </el-col>
    </el-row>

    <!-- 通知列表 -->
    <el-card class="notification-card" v-loading="loading">
      <template #header>
        <div class="card-header">
          <div class="header-left">
            <el-checkbox
              :model-value="isAllSelected"
              @change="handleSelectAll"
              :indeterminate="selectedIds.length > 0 && !isAllSelected"
            >
              全选
            </el-checkbox>
            <span class="selected-count" v-if="selectedIds.length > 0">
              已选择 {{ selectedIds.length }} 项
            </span>
          </div>
          <div class="header-right">
            <el-button
              type="primary"
              :icon="Check"
              size="small"
              @click="markAsRead()"
              :disabled="selectedIds.length === 0"
            >
              标记已读
            </el-button>
            <el-button
              type="danger"
              :icon="Delete"
              size="small"
              @click="deleteNotificationHandler()"
              :disabled="selectedIds.length === 0"
            >
              删除
            </el-button>
            <el-button
              type="info"
              size="small"
              @click="markAllAsRead"
            >
              全部已读
            </el-button>
          </div>
        </div>
      </template>

      <div class="notification-list">
        <div
          v-for="item in filteredNotifications"
          :key="item.id"
          class="notification-item"
          :class="{ unread: !item.read }"
        >
          <el-checkbox
            :model-value="selectedIds.includes(item.id)"
            @change="handleSelect(item.id)"
            class="item-checkbox"
          />

          <div class="item-icon" :style="{ background: item.color }">
            <el-icon :size="20">
              <component :is="item.icon" />
            </el-icon>
          </div>

          <div class="item-content" @click="viewDetail(item)">
            <div class="item-header">
              <h4 class="item-title">{{ item.title }}</h4>
              <span class="item-badge" v-if="!item.read">NEW</span>
            </div>
            <p class="item-desc">{{ item.content }}</p>
            <span class="item-time">{{ item.time }}</span>
          </div>

          <div class="item-actions">
            <el-button
              type="primary"
              :icon="View"
              link
              @click="viewDetail(item)"
            >
              查看
            </el-button>
            <el-button
              v-if="!item.read"
              type="success"
              :icon="Check"
              link
              @click="markAsRead(item.id)"
            >
              已读
            </el-button>
              <el-button
                type="danger"
                :icon="Delete"
                link
                @click="deleteNotificationHandler(item.id)"
              >
                删除
              </el-button>
          </div>
        </div>

        <el-empty
          v-if="filteredNotifications.length === 0"
          description="暂无通知"
          :image-size="120"
        />
      </div>
    </el-card>
  </div>
</template>

<style scoped lang="scss">
.notification-container {
  padding: 20px;

  .stats-row {
    margin-bottom: 24px;

    .stat-card {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 20px;
      background: #fff;
      border-radius: 12px;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
      cursor: pointer;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      border: 2px solid transparent;

      &:hover {
        transform: translateY(-4px);
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
      }

      &.active {
        border-color: #409eff;
        box-shadow: 0 4px 16px rgba(64, 158, 255, 0.3);
      }

      .stat-icon {
        width: 56px;
        height: 56px;
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #fff;
        flex-shrink: 0;
      }

      .stat-info {
        flex: 1;

        .stat-value {
          font-size: 28px;
          font-weight: 700;
          color: #303133;
          line-height: 1;
          margin-bottom: 8px;
        }

        .stat-label {
          font-size: 14px;
          color: #909399;
        }
      }
    }
  }

  .notification-card {
    border-radius: 16px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 16px;

      .header-left {
        display: flex;
        align-items: center;
        gap: 16px;

        .selected-count {
          font-size: 14px;
          color: #409eff;
          font-weight: 500;
        }
      }

      .header-right {
        display: flex;
        gap: 8px;
      }
    }

    .notification-list {
      .notification-item {
        display: flex;
        align-items: flex-start;
        gap: 16px;
        padding: 20px;
        border-bottom: 1px solid #f0f2f5;
        transition: all 0.3s;
        position: relative;

        &:last-child {
          border-bottom: none;
        }

        &:hover {
          background: #f5f7fa;
        }

        &.unread {
          background: rgba(64, 158, 255, 0.05);

          &::before {
            content: '';
            position: absolute;
            left: 0;
            top: 0;
            bottom: 0;
            width: 4px;
            background: #409eff;
          }
        }

        .item-checkbox {
          margin-top: 4px;
        }

        .item-icon {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          flex-shrink: 0;
        }

        .item-content {
          flex: 1;
          cursor: pointer;

          .item-header {
            display: flex;
            align-items: center;
            gap: 8px;
            margin-bottom: 8px;

            .item-title {
              font-size: 16px;
              font-weight: 600;
              color: #303133;
              margin: 0;
            }

            .item-badge {
              display: inline-block;
              padding: 2px 8px;
              background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
              color: #fff;
              font-size: 12px;
              font-weight: 600;
              border-radius: 10px;
            }
          }

          .item-desc {
            font-size: 14px;
            color: #606266;
            margin: 0 0 8px 0;
            line-height: 1.6;
          }

          .item-time {
            font-size: 12px;
            color: #909399;
          }
        }

        .item-actions {
          display: flex;
          gap: 8px;
          flex-shrink: 0;
        }
      }
    }
  }
}

@media (max-width: 768px) {
  .notification-container {
    .stats-row {
      .stat-card {
        .stat-icon {
          width: 48px;
          height: 48px;
        }

        .stat-info {
          .stat-value {
            font-size: 24px;
          }
        }
      }
    }

    .notification-card {
      .card-header {
        .header-right {
          width: 100%;
          justify-content: flex-end;
        }
      }

      .notification-list {
        .notification-item {
          .item-actions {
            flex-direction: column;
          }
        }
      }
    }
  }
}
</style>
