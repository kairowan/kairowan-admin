<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { ElMessage } from 'element-plus'
import { Refresh, Cpu, MemoryCard, HardDrive, Monitor } from '@element-plus/icons-vue'
import { getServerInfo } from '@/api/monitor'

// 服务器信息
const serverInfo = ref<any>({})
const loading = ref(false)

// 获取服务器信息
const getInfo = async () => {
  loading.value = true
  try {
    const res = await getServerInfo()
    serverInfo.value = res.data
  } catch (error) {
    ElMessage.error('获取服务器信息失败')
  } finally {
    loading.value = false
  }
}

// 计算百分比
const calculatePercentage = (used: number, total: number) => {
  if (!total) return 0
  return Math.round((used / total) * 100)
}

// 格式化字节
const formatBytes = (bytes: number) => {
  if (!bytes) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
}

// 自动刷新
let timer: any = null
const autoRefresh = ref(false)

const toggleAutoRefresh = () => {
  autoRefresh.value = !autoRefresh.value
  if (autoRefresh.value) {
    timer = setInterval(() => {
      getInfo()
    }, 5000) // 每5秒刷新一次
  } else {
    if (timer) {
      clearInterval(timer)
      timer = null
    }
  }
}

// 初始化
onMounted(() => {
  getInfo()
})

// 组件卸载时清除定时器
onUnmounted(() => {
  if (timer) {
    clearInterval(timer)
  }
})
</script>

<template>
  <div class="app-container">
    <!-- 操作栏 -->
    <el-card class="header-card" shadow="never">
      <div class="header-content">
        <span class="title">服务器监控</span>
        <div>
          <el-button
            :type="autoRefresh ? 'success' : 'primary'"
            @click="toggleAutoRefresh"
          >
            {{ autoRefresh ? '停止自动刷新' : '开启自动刷新' }}
          </el-button>
          <el-button type="primary" :icon="Refresh" @click="getInfo">手动刷新</el-button>
        </div>
      </div>
    </el-card>

    <!-- CPU信息 -->
    <el-card class="info-card" shadow="never" v-loading="loading">
      <template #header>
        <div class="card-header">
          <el-icon><Cpu /></el-icon>
          <span>CPU信息</span>
        </div>
      </template>
      <el-row :gutter="20">
        <el-col :span="12">
          <div class="info-item">
            <span class="label">核心数:</span>
            <span class="value">{{ serverInfo.cpu?.cores || 0 }} 核</span>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="info-item">
            <span class="label">使用率:</span>
            <span class="value">{{ serverInfo.cpu?.usage?.toFixed(2) || 0 }}%</span>
          </div>
        </el-col>
      </el-row>
      <el-progress
        :percentage="serverInfo.cpu?.usage || 0"
        :color="serverInfo.cpu?.usage > 80 ? '#F56C6C' : '#67C23A'"
        :stroke-width="20"
      />
    </el-card>

    <!-- 内存信息 -->
    <el-card class="info-card" shadow="never" v-loading="loading">
      <template #header>
        <div class="card-header">
          <el-icon><MemoryCard /></el-icon>
          <span>内存信息</span>
        </div>
      </template>
      <el-row :gutter="20">
        <el-col :span="8">
          <div class="info-item">
            <span class="label">总内存:</span>
            <span class="value">{{ formatBytes(serverInfo.memory?.total) }}</span>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="info-item">
            <span class="label">已用:</span>
            <span class="value">{{ formatBytes(serverInfo.memory?.used) }}</span>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="info-item">
            <span class="label">空闲:</span>
            <span class="value">{{ formatBytes(serverInfo.memory?.free) }}</span>
          </div>
        </el-col>
      </el-row>
      <el-progress
        :percentage="calculatePercentage(serverInfo.memory?.used, serverInfo.memory?.total)"
        :color="calculatePercentage(serverInfo.memory?.used, serverInfo.memory?.total) > 80 ? '#F56C6C' : '#67C23A'"
        :stroke-width="20"
      />
    </el-card>

    <!-- JVM信息 -->
    <el-card class="info-card" shadow="never" v-loading="loading">
      <template #header>
        <div class="card-header">
          <el-icon><Monitor /></el-icon>
          <span>JVM信息</span>
        </div>
      </template>
      <el-row :gutter="20">
        <el-col :span="8">
          <div class="info-item">
            <span class="label">最大内存:</span>
            <span class="value">{{ formatBytes(serverInfo.jvm?.max) }}</span>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="info-item">
            <span class="label">已用:</span>
            <span class="value">{{ formatBytes(serverInfo.jvm?.used) }}</span>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="info-item">
            <span class="label">总内存:</span>
            <span class="value">{{ formatBytes(serverInfo.jvm?.total) }}</span>
          </div>
        </el-col>
      </el-row>
      <el-progress
        :percentage="calculatePercentage(serverInfo.jvm?.used, serverInfo.jvm?.max)"
        :color="calculatePercentage(serverInfo.jvm?.used, serverInfo.jvm?.max) > 80 ? '#F56C6C' : '#67C23A'"
        :stroke-width="20"
      />
    </el-card>

    <!-- 磁盘信息 -->
    <el-card class="info-card" shadow="never" v-loading="loading">
      <template #header>
        <div class="card-header">
          <el-icon><HardDrive /></el-icon>
          <span>磁盘信息</span>
        </div>
      </template>
      <el-row :gutter="20">
        <el-col :span="8">
          <div class="info-item">
            <span class="label">总容量:</span>
            <span class="value">{{ formatBytes(serverInfo.disk?.total) }}</span>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="info-item">
            <span class="label">已用:</span>
            <span class="value">{{ formatBytes(serverInfo.disk?.used) }}</span>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="info-item">
            <span class="label">空闲:</span>
            <span class="value">{{ formatBytes(serverInfo.disk?.free) }}</span>
          </div>
        </el-col>
      </el-row>
      <el-progress
        :percentage="calculatePercentage(serverInfo.disk?.used, serverInfo.disk?.total)"
        :color="calculatePercentage(serverInfo.disk?.used, serverInfo.disk?.total) > 80 ? '#F56C6C' : '#67C23A'"
        :stroke-width="20"
      />
    </el-card>
  </div>
</template>

<style scoped lang="scss">
.app-container {
  padding: 20px;

  .header-card {
    margin-bottom: 20px;

    .header-content {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .title {
        font-size: 18px;
        font-weight: bold;
      }
    }
  }

  .info-card {
    margin-bottom: 20px;

    .card-header {
      display: flex;
      align-items: center;
      gap: 8px;
      font-weight: bold;

      .el-icon {
        font-size: 20px;
      }
    }

    .info-item {
      display: flex;
      justify-content: space-between;
      padding: 10px 0;

      .label {
        color: #909399;
      }

      .value {
        font-weight: bold;
        color: #303133;
      }
    }

    .el-progress {
      margin-top: 15px;
    }
  }
}
</style>
