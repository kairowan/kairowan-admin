<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search, Delete, Refresh, View } from '@element-plus/icons-vue'
import { getOperlogList, delOperlog, cleanOperlog } from '@/api/monitor'

// 查询参数
const queryParams = reactive({
  pageNum: 1,
  pageSize: 10,
  title: '',
  operName: '',
  businessType: '',
  status: '',
  operTime: []
})

// 表格数据
const loading = ref(false)
const tableData = ref([])
const total = ref(0)
const selectedIds = ref<number[]>([])

// 详情对话框
const detailVisible = ref(false)
const detailData = ref<any>({})

// 业务类型选项
const businessTypeOptions = [
  { label: '其它', value: '0' },
  { label: '新增', value: '1' },
  { label: '修改', value: '2' },
  { label: '删除', value: '3' },
  { label: '授权', value: '4' },
  { label: '导出', value: '5' },
  { label: '导入', value: '6' },
  { label: '强退', value: '7' },
  { label: '清空', value: '8' }
]

// 获取列表
const getList = async () => {
  loading.value = true
  try {
    const res = await getOperlogList(queryParams)
    tableData.value = res.rows
    total.value = res.total
  } catch (error) {
    ElMessage.error('获取操作日志失败')
  } finally {
    loading.value = false
  }
}

// 搜索
const handleQuery = () => {
  queryParams.pageNum = 1
  getList()
}

// 重置
const resetQuery = () => {
  Object.assign(queryParams, {
    pageNum: 1,
    pageSize: 10,
    title: '',
    operName: '',
    businessType: '',
    status: '',
    operTime: []
  })
  getList()
}

// 查看详情
const handleView = (row: any) => {
  detailData.value = row
  detailVisible.value = true
}

// 删除
const handleDelete = (row: any) => {
  ElMessageBox.confirm('确认删除该操作日志吗?', '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      await delOperlog([row.operId])
      ElMessage.success('删除成功')
      getList()
    } catch (error) {
      ElMessage.error('删除失败')
    }
  })
}

// 批量删除
const handleBatchDelete = () => {
  if (selectedIds.value.length === 0) {
    ElMessage.warning('请选择要删除的数据')
    return
  }
  ElMessageBox.confirm(`确认删除选中的${selectedIds.value.length}条数据吗?`, '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      await delOperlog(selectedIds.value)
      ElMessage.success('删除成功')
      getList()
    } catch (error) {
      ElMessage.error('删除失败')
    }
  })
}

// 清空
const handleClean = () => {
  ElMessageBox.confirm('确认清空所有操作日志吗?', '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      await cleanOperlog()
      ElMessage.success('清空成功')
      getList()
    } catch (error) {
      ElMessage.error('清空失败')
    }
  })
}

// 表格选择
const handleSelectionChange = (selection: any[]) => {
  selectedIds.value = selection.map(item => item.operId)
}

// 分页
const handleSizeChange = (val: number) => {
  queryParams.pageSize = val
  getList()
}

const handleCurrentChange = (val: number) => {
  queryParams.pageNum = val
  getList()
}

// 初始化
onMounted(() => {
  getList()
})
</script>

<template>
  <div class="app-container">
    <!-- 搜索栏 -->
    <el-card class="search-card" shadow="never">
      <el-form :model="queryParams" inline>
        <el-form-item label="系统模块">
          <el-input
            v-model="queryParams.title"
            placeholder="请输入系统模块"
            clearable
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item label="操作人员">
          <el-input
            v-model="queryParams.operName"
            placeholder="请输入操作人员"
            clearable
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item label="类型">
          <el-select v-model="queryParams.businessType" placeholder="操作类型" clearable>
            <el-option
              v-for="item in businessTypeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="queryParams.status" placeholder="操作状态" clearable>
            <el-option label="成功" value="0" />
            <el-option label="失败" value="1" />
          </el-select>
        </el-form-item>
        <el-form-item label="操作时间">
          <el-date-picker
            v-model="queryParams.operTime"
            type="daterange"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :icon="Search" @click="handleQuery">搜索</el-button>
          <el-button :icon="Refresh" @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 操作栏 -->
    <el-card class="table-card" shadow="never">
      <template #header>
        <div class="card-header">
          <span>操作日志</span>
          <div>
            <el-button
              type="danger"
              :icon="Delete"
              @click="handleBatchDelete"
              v-permission="['monitor:operlog:remove']"
            >
              批量删除
            </el-button>
            <el-button
              type="danger"
              :icon="Delete"
              @click="handleClean"
              v-permission="['monitor:operlog:remove']"
            >
              清空
            </el-button>
          </div>
        </div>
      </template>

      <!-- 表格 -->
      <el-table
        v-loading="loading"
        :data="tableData"
        border
        stripe
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="日志编号" prop="operId" width="80" />
        <el-table-column label="系统模块" prop="title" :show-overflow-tooltip="true" />
        <el-table-column label="操作类型" prop="businessType" width="100">
          <template #default="{ row }">
            {{ businessTypeOptions.find(item => item.value === String(row.businessType))?.label }}
          </template>
        </el-table-column>
        <el-table-column label="请求方式" prop="requestMethod" width="100" />
        <el-table-column label="操作人员" prop="operName" width="120" />
        <el-table-column label="操作地址" prop="operIp" width="130" />
        <el-table-column label="操作状态" align="center" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 0 ? 'success' : 'danger'">
              {{ row.status === 0 ? '成功' : '失败' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作时间" prop="operTime" width="160" />
        <el-table-column label="操作" align="center" width="150" fixed="right">
          <template #default="{ row }">
            <el-button
              link
              type="primary"
              :icon="View"
              @click="handleView(row)"
            >
              详情
            </el-button>
            <el-button
              link
              type="danger"
              :icon="Delete"
              @click="handleDelete(row)"
              v-permission="['monitor:operlog:remove']"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <el-pagination
        v-model:current-page="queryParams.pageNum"
        v-model:page-size="queryParams.pageSize"
        :total="total"
        :page-sizes="[10, 20, 50, 100]"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </el-card>

    <!-- 详情对话框 -->
    <el-dialog v-model="detailVisible" title="操作日志详情" width="800px">
      <el-descriptions :column="2" border>
        <el-descriptions-item label="日志编号">{{ detailData.operId }}</el-descriptions-item>
        <el-descriptions-item label="操作模块">{{ detailData.title }}</el-descriptions-item>
        <el-descriptions-item label="业务类型">
          {{ businessTypeOptions.find(item => item.value === String(detailData.businessType))?.label }}
        </el-descriptions-item>
        <el-descriptions-item label="请求方式">{{ detailData.requestMethod }}</el-descriptions-item>
        <el-descriptions-item label="操作人员">{{ detailData.operName }}</el-descriptions-item>
        <el-descriptions-item label="操作地址">{{ detailData.operIp }}</el-descriptions-item>
        <el-descriptions-item label="操作状态">
          <el-tag :type="detailData.status === 0 ? 'success' : 'danger'">
            {{ detailData.status === 0 ? '成功' : '失败' }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="操作时间">{{ detailData.operTime }}</el-descriptions-item>
        <el-descriptions-item label="请求URL" :span="2">{{ detailData.operUrl }}</el-descriptions-item>
        <el-descriptions-item label="方法名称" :span="2">{{ detailData.method }}</el-descriptions-item>
        <el-descriptions-item label="请求参数" :span="2">
          <el-input v-model="detailData.operParam" type="textarea" :rows="3" readonly />
        </el-descriptions-item>
        <el-descriptions-item label="返回参数" :span="2">
          <el-input v-model="detailData.jsonResult" type="textarea" :rows="3" readonly />
        </el-descriptions-item>
        <el-descriptions-item label="错误消息" :span="2" v-if="detailData.errorMsg">
          <el-input v-model="detailData.errorMsg" type="textarea" :rows="3" readonly />
        </el-descriptions-item>
      </el-descriptions>
    </el-dialog>
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

    .el-pagination {
      margin-top: 20px;
      justify-content: flex-end;
    }
  }
}
</style>
