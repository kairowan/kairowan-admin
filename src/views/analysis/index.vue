<script setup lang="ts">
import { ref, computed } from 'vue'
import Chart from '@/components/Chart/index.vue'
import type { EChartsOption } from 'echarts'
import { Download, Refresh } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const dateRange = ref<[Date, Date]>([
  new Date(2026, 0, 1),
  new Date(2026, 0, 29)
])

// 销售趋势图
const salesTrendOption = computed<EChartsOption>(() => ({
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'cross'
    }
  },
  legend: {
    data: ['销售额', '订单量'],
    bottom: 0
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '10%',
    containLabel: true
  },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
  },
  yAxis: [
    {
      type: 'value',
      name: '销售额(万元)',
      position: 'left',
      axisLine: {
        lineStyle: {
          color: '#409eff'
        }
      }
    },
    {
      type: 'value',
      name: '订单量',
      position: 'right',
      axisLine: {
        lineStyle: {
          color: '#67c23a'
        }
      }
    }
  ],
  series: [
    {
      name: '销售额',
      type: 'line',
      smooth: true,
      data: [120, 132, 101, 134, 90, 230, 210, 182, 191, 234, 290, 330],
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
      }
    },
    {
      name: '订单量',
      type: 'line',
      smooth: true,
      yAxisIndex: 1,
      data: [220, 182, 191, 234, 290, 330, 310, 201, 154, 190, 330, 410],
      lineStyle: {
        width: 3,
        color: '#67c23a'
      }
    }
  ]
}))

// 分类占比饼图
const categoryOption = computed<EChartsOption>(() => ({
  tooltip: {
    trigger: 'item',
    formatter: '{a} <br/>{b}: {c} ({d}%)'
  },
  legend: {
    orient: 'vertical',
    right: '10%',
    top: 'center'
  },
  series: [
    {
      name: '销售分类',
      type: 'pie',
      radius: ['40%', '70%'],
      center: ['40%', '50%'],
      avoidLabelOverlap: false,
      itemStyle: {
        borderRadius: 10,
        borderColor: '#fff',
        borderWidth: 2
      },
      label: {
        show: false
      },
      emphasis: {
        label: {
          show: true,
          fontSize: 16,
          fontWeight: 'bold'
        }
      },
      data: [
        { value: 1048, name: '电子产品', itemStyle: { color: '#409eff' } },
        { value: 735, name: '服装鞋帽', itemStyle: { color: '#67c23a' } },
        { value: 580, name: '食品饮料', itemStyle: { color: '#e6a23c' } },
        { value: 484, name: '家居用品', itemStyle: { color: '#f56c6c' } },
        { value: 300, name: '其他', itemStyle: { color: '#909399' } }
      ]
    }
  ]
}))

// 地区销售柱状图
const regionSalesOption = computed<EChartsOption>(() => ({
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
    data: ['北京', '上海', '广州', '深圳', '杭州', '成都', '武汉', '西安']
  },
  yAxis: {
    type: 'value',
    name: '销售额(万元)'
  },
  series: [
    {
      name: '销售额',
      type: 'bar',
      data: [320, 302, 301, 334, 390, 330, 320, 280],
      itemStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            { offset: 0, color: '#409eff' },
            { offset: 1, color: '#66b1ff' }
          ]
        },
        borderRadius: [8, 8, 0, 0]
      },
      barWidth: '60%'
    }
  ]
}))

// 用户增长雷达图
const userGrowthOption = computed<EChartsOption>(() => ({
  tooltip: {},
  radar: {
    indicator: [
      { name: '新增用户', max: 100 },
      { name: '活跃用户', max: 100 },
      { name: '留存率', max: 100 },
      { name: '转化率', max: 100 },
      { name: '满意度', max: 100 }
    ],
    radius: '65%'
  },
  series: [
    {
      name: '用户指标',
      type: 'radar',
      data: [
        {
          value: [85, 90, 75, 80, 88],
          name: '本月',
          areaStyle: {
            color: 'rgba(64, 158, 255, 0.3)'
          },
          lineStyle: {
            color: '#409eff',
            width: 2
          },
          itemStyle: {
            color: '#409eff'
          }
        },
        {
          value: [70, 82, 68, 72, 80],
          name: '上月',
          areaStyle: {
            color: 'rgba(103, 194, 58, 0.3)'
          },
          lineStyle: {
            color: '#67c23a',
            width: 2
          },
          itemStyle: {
            color: '#67c23a'
          }
        }
      ]
    }
  ]
}))

// 刷新数据
const refreshData = () => {
  ElMessage.success('数据已刷新')
}

// 导出报表
const exportReport = () => {
  ElMessage.success('报表导出中...')
}
</script>

<template>
  <div class="analysis-container">
    <!-- 顶部操作栏 -->
    <el-card class="toolbar-card">
      <div class="toolbar">
        <div class="toolbar-left">
          <el-date-picker
            v-model="dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            size="default"
          />
        </div>
        <div class="toolbar-right">
          <el-button :icon="Refresh" @click="refreshData">刷新</el-button>
          <el-button type="primary" :icon="Download" @click="exportReport">
            导出报表
          </el-button>
        </div>
      </div>
    </el-card>

    <!-- 数据概览卡片 -->
    <el-row :gutter="20" class="overview-row">
      <el-col :xs="12" :sm="6">
        <div class="overview-card">
          <div class="overview-icon" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%)">
            <el-icon :size="32"><TrendCharts /></el-icon>
          </div>
          <div class="overview-info">
            <div class="overview-label">总销售额</div>
            <div class="overview-value">¥2,456,789</div>
            <div class="overview-trend up">
              <el-icon><CaretTop /></el-icon>
              <span>12.5%</span>
            </div>
          </div>
        </div>
      </el-col>

      <el-col :xs="12" :sm="6">
        <div class="overview-card">
          <div class="overview-icon" style="background: linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)">
            <el-icon :size="32"><ShoppingCart /></el-icon>
          </div>
          <div class="overview-info">
            <div class="overview-label">订单总数</div>
            <div class="overview-value">8,234</div>
            <div class="overview-trend up">
              <el-icon><CaretTop /></el-icon>
              <span>8.3%</span>
            </div>
          </div>
        </div>
      </el-col>

      <el-col :xs="12" :sm="6">
        <div class="overview-card">
          <div class="overview-icon" style="background: linear-gradient(135deg, #fa709a 0%, #fee140 100%)">
            <el-icon :size="32"><User /></el-icon>
          </div>
          <div class="overview-info">
            <div class="overview-label">新增用户</div>
            <div class="overview-value">1,234</div>
            <div class="overview-trend down">
              <el-icon><CaretBottom /></el-icon>
              <span>3.2%</span>
            </div>
          </div>
        </div>
      </el-col>

      <el-col :xs="12" :sm="6">
        <div class="overview-card">
          <div class="overview-icon" style="background: linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%)">
            <el-icon :size="32"><Coin /></el-icon>
          </div>
          <div class="overview-info">
            <div class="overview-label">客单价</div>
            <div class="overview-value">¥298</div>
            <div class="overview-trend up">
              <el-icon><CaretTop /></el-icon>
              <span>5.7%</span>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>

    <!-- 图表区域 -->
    <el-row :gutter="20" class="chart-row">
      <!-- 销售趋势 -->
      <el-col :xs="24" :lg="16">
        <el-card class="chart-card">
          <template #header>
            <div class="card-header">
              <span class="card-title">
                <el-icon><TrendCharts /></el-icon>
                销售趋势分析
              </span>
            </div>
          </template>
          <Chart :option="salesTrendOption" height="400px" />
        </el-card>
      </el-col>

      <!-- 分类占比 -->
      <el-col :xs="24" :lg="8">
        <el-card class="chart-card">
          <template #header>
            <div class="card-header">
              <span class="card-title">
                <el-icon><PieChart /></el-icon>
                销售分类占比
              </span>
            </div>
          </template>
          <Chart :option="categoryOption" height="400px" />
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" class="chart-row">
      <!-- 地区销售 -->
      <el-col :xs="24" :lg="12">
        <el-card class="chart-card">
          <template #header>
            <div class="card-header">
              <span class="card-title">
                <el-icon><Location /></el-icon>
                地区销售排行
              </span>
            </div>
          </template>
          <Chart :option="regionSalesOption" height="350px" />
        </el-card>
      </el-col>

      <!-- 用户增长 -->
      <el-col :xs="24" :lg="12">
        <el-card class="chart-card">
          <template #header>
            <div class="card-header">
              <span class="card-title">
                <el-icon><DataAnalysis /></el-icon>
                用户增长分析
              </span>
            </div>
          </template>
          <Chart :option="userGrowthOption" height="350px" />
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<style scoped lang="scss">
.analysis-container {
  padding: 20px;

  .toolbar-card {
    margin-bottom: 24px;
    border-radius: 16px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);

    .toolbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 16px;

      .toolbar-right {
        display: flex;
        gap: 12px;
      }
    }
  }

  .overview-row {
    margin-bottom: 24px;

    .overview-card {
      display: flex;
      align-items: center;
      gap: 20px;
      padding: 24px;
      background: #fff;
      border-radius: 16px;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

      &:hover {
        transform: translateY(-4px);
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
      }

      .overview-icon {
        width: 72px;
        height: 72px;
        border-radius: 16px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #fff;
        flex-shrink: 0;
      }

      .overview-info {
        flex: 1;

        .overview-label {
          font-size: 14px;
          color: #909399;
          margin-bottom: 8px;
        }

        .overview-value {
          font-size: 28px;
          font-weight: 700;
          color: #303133;
          margin-bottom: 8px;
        }

        .overview-trend {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 4px 12px;
          border-radius: 12px;
          font-size: 13px;
          font-weight: 600;

          &.up {
            background: rgba(103, 194, 58, 0.1);
            color: #67c23a;
          }

          &.down {
            background: rgba(245, 108, 108, 0.1);
            color: #f56c6c;
          }
        }
      }
    }
  }

  .chart-row {
    margin-bottom: 24px;

    .chart-card {
      border-radius: 16px;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
      transition: all 0.3s;

      &:hover {
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
      }

      .card-header {
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
      }
    }
  }
}

@media (max-width: 768px) {
  .analysis-container {
    .toolbar-card {
      .toolbar {
        .toolbar-left,
        .toolbar-right {
          width: 100%;
        }

        .toolbar-right {
          justify-content: flex-end;
        }
      }
    }

    .overview-row {
      .overview-card {
        .overview-icon {
          width: 56px;
          height: 56px;
        }

        .overview-info {
          .overview-value {
            font-size: 24px;
          }
        }
      }
    }
  }
}
</style>
