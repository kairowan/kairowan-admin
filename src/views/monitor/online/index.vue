<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Refresh, Delete } from '@element-plus/icons-vue'
import { getOnlineList, forceLogout } from '@/api/monitor'

// 查询参数
const queryParams = reactive({
  userName: '',
  ipaddr: ''
})

// 表格数据
const loading = ref(false)
const tableData = ref([])

// 获取列表
const getList = async () => {
  loading.value = true
  try {
    const res = await getOnlineList(queryParams)
    // 后端返回格式：{ code, msg, data: [...] }
    // 响应拦截器会返回 data 字段的内容
    tableData.value = Array.isArray(res) ? res : (res.data || res || [])
  } catch (error) {
    ElMessage.error('获取在线用户列表失败')
    tableData.value = []
  } finally {
    loading.value = false
  }
}

// 搜索
const handleQuery = () => {
  getList()
}

// 重置
const resetQuery = () => {
  Object.assign(queryParams, {
    userName: '',
    ipaddr: ''
  })
  getList()
}

// 强制踢出
const handleForceLogout = (row: any) => {
  ElMessageBox.confirm(`确认强制踢出用户"${row.userName}"吗?`, '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      await forceLogout(row.tokenId)
      ElMessage.success('踢出成功')
      getList()
    } catch (error) {
      ElMessage.error('踢出失败')
    }
  })
}

// 自动刷新
let timer: any = null
const autoRefresh = ref(false)

const toggleAutoRefresh = () => {
  autoRefresh.value = !autoRefresh.value
  if (autoRefresh.value) {
    timer = setInterval(() => {
      getList()
    }, 10000) // 每10秒刷新一次
  } else {
    if (timer) {
      clearInterval(timer)
      timer = null
    }
  }
}

// 初始化
onMounted(() => {
  getList()
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
    <!-- 搜索栏 -->
    <el-card class="search-card" shadow="never">
      <el-form :model="queryParams" inline>
        <el-form-item label="用户名称">
          <el-input
            v-model="queryParams.userName"
            placeholder="请输入用户名称"
            clearable
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item label="登录地址">
          <el-input
            v-model="queryParams.ipaddr"
            placeholder="请输入登录地址"
            clearable
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleQuery">搜索</el-button>
          <el-button @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 操作栏 -->
    <el-card class="table-card" shadow="never">
      <template #header>
        <div class="card-header">
          <span>在线用户列表 ({{ tableData.length }})</span>
          <div>
            <el-button
              :type="autoRefresh ? 'success' : 'primary'"
              @click="toggleAutoRefresh"
            >
              {{ autoRefresh ? '停止自动刷新' : '开启自动刷新' }}
            </el-button>
            <el-button type="primary" :icon="Refresh" @click="getList">刷新</el-button>
          </div>
        </div>
      </template>

      <!-- 表格 -->
      <el-table v-loading="loading" :data="tableData" border stripe>
        <el-table-column label="序号" type="index" width="60" />
        <el-table-column label="用户名称" prop="userName" :show-overflow-tooltip="true" />
        <el-table-column label="部门名称" prop="deptName" :show-overflow-tooltip="true" />
        <el-table-column label="登录IP" prop="ipaddr" width="130" />
        <el-table-column label="登录地点" prop="loginLocation" :show-overflow-tooltip="true" />
        <el-table-column label="浏览器" prop="browser" :show-overflow-tooltip="true" />
        <el-table-column label="操作系统" prop="os" :show-overflow-tooltip="true" />
        <el-table-column label="登录时间" prop="loginTime" width="160" />
        <el-table-column label="操作" align="center" width="120" fixed="right">
          <template #default="{ row }">
            <el-button
              link
              type="danger"
              :icon="Delete"
              @click="handleForceLogout(row)"
              v-permission="['monitor:online:forceLogout']"
            >
              强制踢出
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<style scoped lang="scss">
.app-container {
  padding: 20px;

  .search-card {
    margin-bottom: 20px;
  }

  .table-card {
    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  }
}
</style>
