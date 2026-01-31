<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { getDashboardStats, getSystemInfo } from '@/api/dashboard'
import { ElMessage } from 'element-plus'
import { ArrowUp, ArrowDown } from '@element-plus/icons-vue'
import Chart from '@/components/Chart/index.vue'
import type { EChartsOption } from 'echarts'

const authStore = useAuthStore()

const loading = ref(false)
const stats = ref([
  {
    title: '用户总数',
    value: 0,
    icon: 'User',
    color: '#409eff',
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    key: 'userCount',
    trend: 'up',
    change: 12.5
  },
  {
    title: '今日访问',
    value: 0,
    icon: 'View',
    color: '#67c23a',
    gradient: 'linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)',
    key: 'visitCount',
    trend: 'up',
    change: 8.3
  },
  {
    title: '消息数量',
    value: 0,
    icon: 'Message',
    color: '#e6a23c',
    gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    key: 'messageCount',
    trend: 'down',
    change: 3.2
  },
  {
    title: '订单数量',
    value: 0,
    icon: 'ShoppingCart',
    color: '#f56c6c',
    gradient: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%)',
    key: 'orderCount',
    trend: 'up',
    change: 15.7
  }
])

const systemInfo = ref({
  version: 'v1.0.0',
  backendFramework: 'Ktor 3.0',
  frontendFramework: 'Vue 3.5',
  uiFramework: 'Element Plus 2.13'
})

// 访问趋势图表配置
const visitTrendOption = computed<EChartsOption>(() => ({
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow'
    }
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true
  },
  xAxis: {
    type: 'category',
    data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
    axisLine: {
      lineStyle: {
        color: '#e0e6ed'
      }
    },
    axisLabel: {
      color: '#606266'
    }
  },
  yAxis: {
    type: 'value',
    axisLine: {
      show: false
    },
    axisTick: {
      show: false
    },
    axisLabel: {
      color: '#606266'
    },
    splitLine: {
      lineStyle: {
        color: '#f0f2f5',
        type: 'dashed'
      }
    }
  },
  series: [
    {
      name: '访问量',
      type: 'line',
      smooth: true,
      data: [120, 200, 150, 80, 70, 110, 130],
      areaStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            { offset: 0, color: 'rgba(64, 158, 255, 0.3)' },
            { offset: 1, color: 'rgba(64, 158, 255, 0.05)' }
          ]
        }
      },
      lineStyle: {
        width: 3,
        color: '#409eff'
      },
      itemStyle: {
        color: '#409eff',
        borderWidth: 2,
        borderColor: '#fff'
      }
    }
  ]
}))

// 数据分布饼图配置
const dataDistributionOption = computed<EChartsOption>(() => ({
  tooltip: {
    trigger: 'item',
    formatter: '{a} <br/>{b}: {c} ({d}%)'
  },
  legend: {
    bottom: '5%',
    left: 'center'
  },
  series: [
    {
      name: '数据分布',
      type: 'pie',
      radius: ['40%', '70%'],
      avoidLabelOverlap: false,
      itemStyle: {
        borderRadius: 10,
        borderColor: '#fff',
        borderWidth: 2
      },
      label: {
        show: false,
        position: 'center'
      },
      emphasis: {
        label: {
          show: true,
          fontSize: 20,
          fontWeight: 'bold'
        }
      },
      labelLine: {
        show: false
      },
      data: [
        { value: 1048, name: '用户管理', itemStyle: { color: '#409eff' } },
        { value: 735, name: '角色管理', itemStyle: { color: '#67c23a' } },
        { value: 580, name: '菜单管理', itemStyle: { color: '#e6a23c' } },
        { value: 484, name: '系统监控', itemStyle: { color: '#f56c6c' } },
        { value: 300, name: '其他', itemStyle: { color: '#909399' } }
      ]
    }
  ]
}))

// 获取统计数据
const getStats = async () => {
  loading.value = true
  try {
    const res = await getDashboardStats()
    const data = Array.isArray(res) ? {} : (res.data || res)

    // 更新统计数据
    stats.value.forEach(item => {
      if (data[item.key] !== undefined) {
        item.value = data[item.key]
      }
    })
  } catch (error) {
    console.error('获取统计数据失败:', error)
    ElMessage.error('获取统计数据失败')
  } finally {
    loading.value = false
  }
}

// 获取系统信息
const getSystemData = async () => {
  try {
    const res = await getSystemInfo()
    const data = Array.isArray(res) ? {} : (res.data || res)

    if (data.version) systemInfo.value.version = data.version
    if (data.backendFramework) systemInfo.value.backendFramework = data.backendFramework
    if (data.frontendFramework) systemInfo.value.frontendFramework = data.frontendFramework
    if (data.uiFramework) systemInfo.value.uiFramework = data.uiFramework
  } catch (error) {
    console.error('获取系统信息失败:', error)
  }
}

onMounted(() => {
  getStats()
  getSystemData()
})
</script>

<template>
  <div class="dashboard-container">
    <!-- 欢迎卡片 -->
    <div class="welcome-card">
      <div class="welcome-content">
        <div class="welcome-text">
          <h2>👋 欢迎回来，{{ authStore.nickName || authStore.userName }}！</h2>
          <p>今天是个美好的一天，让我们开始工作吧</p>
        </div>
        <div class="welcome-time">
          <div class="time-info">
            <span class="time">{{ new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }) }}</span>
            <span class="date">{{ new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' }) }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 统计卡片 -->
    <el-row :gutter="20" class="stats-row" v-loading="loading">
      <el-col :xs="24" :sm="12" :md="6" v-for="item in stats" :key="item.title">
        <div class="stat-card" :style="{ '--card-gradient': item.gradient }">
          <div class="stat-icon-wrapper">
            <div class="stat-icon">
              <el-icon :size="32">
                <component :is="item.icon" />
              </el-icon>
            </div>
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ item.value.toLocaleString() }}</div>
            <div class="stat-title">{{ item.title }}</div>
            <div class="stat-trend" :class="item.trend">
              <el-icon :size="14">
                <ArrowUp v-if="item.trend === 'up'" />
                <ArrowDown v-else />
              </el-icon>
              <span>{{ item.change }}%</span>
              <span class="trend-text">较昨日</span>
            </div>
          </div>
          <div class="stat-bg-icon">
            <el-icon :size="80">
              <component :is="item.icon" />
            </el-icon>
          </div>
        </div>
      </el-col>
    </el-row>

    <!-- 内容区域 -->
    <el-row :gutter="20" class="content-row">
      <!-- 访问趋势图 -->
      <el-col :xs="24" :lg="16">
        <el-card class="content-card chart-card">
          <template #header>
            <div class="card-header">
              <span class="card-title">
                <el-icon><TrendCharts /></el-icon>
                访问趋势
              </span>
              <el-radio-group size="small" model-value="week">
                <el-radio-button label="week">本周</el-radio-button>
                <el-radio-button label="month">本月</el-radio-button>
                <el-radio-button label="year">本年</el-radio-button>
              </el-radio-group>
            </div>
          </template>
          <Chart :option="visitTrendOption" height="350px" />
        </el-card>
      </el-col>

      <!-- 数据分布饼图 -->
      <el-col :xs="24" :lg="8">
        <el-card class="content-card chart-card">
          <template #header>
            <div class="card-header">
              <span class="card-title">
                <el-icon><PieChart /></el-icon>
                数据分布
              </span>
            </div>
          </template>
          <Chart :option="dataDistributionOption" height="350px" />
        </el-card>
      </el-col>
    </el-row>

    <!-- 底部内容区域 -->
    <el-row :gutter="20" class="content-row">
      <el-col :xs="24" :md="12">
        <el-card class="content-card">
          <template #header>
            <div class="card-header">
              <span class="card-title">
                <el-icon><Grid /></el-icon>
                快速入口
              </span>
            </div>
          </template>
          <div class="quick-links">
            <el-button type="primary" link>用户管理</el-button>
            <el-button type="primary" link>角色管理</el-button>
            <el-button type="primary" link>菜单管理</el-button>
            <el-button type="primary" link>系统监控</el-button>
          </div>
        </el-card>
      </el-col>

      <el-col :xs="24" :md="12">
        <el-card class="content-card">
          <template #header>
            <div class="card-header">
              <span class="card-title">
                <el-icon><InfoFilled /></el-icon>
                系统信息
              </span>
            </div>
          </template>
          <div class="system-info">
            <div class="info-item">
              <span class="label">系统版本：</span>
              <span class="value">{{ systemInfo.version }}</span>
            </div>
            <div class="info-item">
              <span class="label">后端框架：</span>
              <span class="value">{{ systemInfo.backendFramework }}</span>
            </div>
            <div class="info-item">
              <span class="label">前端框架：</span>
              <span class="value">{{ systemInfo.frontendFramework }}</span>
            </div>
            <div class="info-item">
              <span class="label">UI 框架：</span>
              <span class="value">{{ systemInfo.uiFramework }}</span>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<style scoped lang="scss">
.dashboard-container {
  .welcome-card {
    padding: 32px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 16px;
    color: white;
    margin-bottom: 24px;
    box-shadow: 0 8px 24px rgba(102, 126, 234, 0.3);
    position: relative;
    overflow: hidden;

    &::before {
      content: '';
      position: absolute;
      top: -50%;
      right: -10%;
      width: 400px;
      height: 400px;
      background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
      border-radius: 50%;
    }

    .welcome-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      position: relative;
      z-index: 1;

      .welcome-text {
        h2 {
          margin: 0 0 12px 0;
          font-size: 28px;
          font-weight: 700;
          text-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        p {
          margin: 0;
          font-size: 15px;
          opacity: 0.95;
        }
      }

      .welcome-time {
        .time-info {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 4px;

          .time {
            font-size: 32px;
            font-weight: 700;
            text-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          }

          .date {
            font-size: 14px;
            opacity: 0.9;
          }
        }
      }
    }
  }

  .stats-row {
    margin-bottom: 24px;

    .stat-card {
      background: #fff;
      border-radius: 16px;
      padding: 24px;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      cursor: pointer;
      position: relative;
      overflow: hidden;
      height: 160px;

      &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 4px;
        background: var(--card-gradient);
      }

      &:hover {
        transform: translateY(-8px);
        box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);

        .stat-icon-wrapper {
          transform: scale(1.1) rotate(5deg);
        }

        .stat-bg-icon {
          opacity: 0.15;
          transform: translate(10px, -10px) rotate(15deg);
        }
      }

      .stat-icon-wrapper {
        margin-bottom: 16px;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

        .stat-icon {
          width: 56px;
          height: 56px;
          border-radius: 12px;
          background: var(--card-gradient);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }
      }

      .stat-content {
        position: relative;
        z-index: 1;

        .stat-value {
          font-size: 32px;
          font-weight: 700;
          color: #303133;
          margin-bottom: 8px;
          line-height: 1;
        }

        .stat-title {
          font-size: 14px;
          color: #909399;
          margin-bottom: 12px;
        }

        .stat-trend {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 4px 12px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 600;

          &.up {
            background: rgba(103, 194, 58, 0.1);
            color: #67c23a;
          }

          &.down {
            background: rgba(245, 108, 108, 0.1);
            color: #f56c6c;
          }

          .trend-text {
            opacity: 0.7;
            margin-left: 4px;
          }
        }
      }

      .stat-bg-icon {
        position: absolute;
        right: -10px;
        bottom: -10px;
        color: #f5f7fa;
        opacity: 0.08;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        pointer-events: none;
      }
    }
  }

  .content-row {
    margin-bottom: 24px;

    .content-card {
      border-radius: 16px;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
      transition: all 0.3s;
      height: 100%;

      &:hover {
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
      }

      :deep(.el-card__header) {
        border-bottom: 1px solid #f0f2f5;
        padding: 20px;
      }

      :deep(.el-card__body) {
        padding: 20px;
      }

      &.chart-card {
        :deep(.el-card__body) {
          padding: 16px;
        }
      }

      .card-header {
        display: flex;
        justify-content: space-between;
        align-items: center;

        .card-title {
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: 600;
          font-size: 16px;
          color: #303133;

          .el-icon {
            color: #409eff;
          }
        }

        .el-radio-group {
          :deep(.el-radio-button__inner) {
            padding: 8px 15px;
            border-radius: 6px;
          }
        }
      }

      .quick-links {
        display: flex;
        flex-direction: column;
        gap: 12px;

        .el-button {
          justify-content: flex-start;
          font-size: 14px;
          padding: 12px 16px;
          border-radius: 8px;
          transition: all 0.3s;

          &:hover {
            background: rgba(64, 158, 255, 0.1);
            transform: translateX(4px);
          }
        }
      }

      .system-info {
        .info-item {
          display: flex;
          padding: 16px 0;
          border-bottom: 1px solid #f0f2f5;
          transition: all 0.3s;

          &:last-child {
            border-bottom: none;
          }

          &:hover {
            background: #f5f7fa;
            padding-left: 12px;
            margin: 0 -12px;
          }

          .label {
            width: 120px;
            color: #909399;
            font-size: 14px;
          }

          .value {
            flex: 1;
            color: #303133;
            font-weight: 600;
            font-size: 14px;
          }
        }
      }
    }
  }
}

@media (max-width: 768px) {
  .dashboard-container {
    .welcome-card {
      .welcome-content {
        flex-direction: column;
        align-items: flex-start;
        gap: 16px;

        .welcome-time {
          .time-info {
            align-items: flex-start;
          }
        }
      }
    }
  }
}
</style>
