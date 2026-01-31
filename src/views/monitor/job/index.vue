<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search, Plus, Edit, Delete, Refresh, VideoPlay, VideoPause } from '@element-plus/icons-vue'
import { getJobList, addJob, updateJob, delJob, pauseJob, resumeJob, runJob } from '@/api/monitor'

// 查询参数
const queryParams = reactive({
  pageNum: 1,
  pageSize: 10,
  jobName: '',
  jobGroup: '',
  status: ''
})

// 表格数据
const loading = ref(false)
const tableData = ref([])
const total = ref(0)

// 对话框
const dialogVisible = ref(false)
const dialogTitle = ref('')
const formRef = ref()
const form = reactive({
  jobId: undefined,
  jobName: '',
  jobGroup: 'DEFAULT',
  invokeTarget: '',
  cronExpression: '',
  misfirePolicy: '3',
  concurrent: '1',
  status: '0',
  remark: ''
})

// 表单验证规则
const rules = {
  jobName: [
    { required: true, message: '请输入任务名称', trigger: 'blur' }
  ],
  invokeTarget: [
    { required: true, message: '请输入调用目标', trigger: 'blur' }
  ],
  cronExpression: [
    { required: true, message: '请输入CRON表达式', trigger: 'blur' }
  ]
}

// 获取列表
const getList = async () => {
  loading.value = true
  try {
    const res = await getJobList(queryParams)
    tableData.value = res.rows
    total.value = res.total
  } catch (error) {
    ElMessage.error('获取任务列表失败')
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
    jobName: '',
    jobGroup: '',
    status: ''
  })
  getList()
}

// 新增
const handleAdd = () => {
  dialogTitle.value = '新增任务'
  resetForm()
  dialogVisible.value = true
}

// 修改
const handleUpdate = (row: any) => {
  dialogTitle.value = '修改任务'
  resetForm()
  Object.assign(form, row)
  dialogVisible.value = true
}

// 删除
const handleDelete = (row: any) => {
  ElMessageBox.confirm(`确认删除任务"${row.jobName}"吗?`, '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      await delJob(row.jobId)
      ElMessage.success('删除成功')
      getList()
    } catch (error) {
      ElMessage.error('删除失败')
    }
  })
}

// 暂停任务
const handlePause = async (row: any) => {
  try {
    await pauseJob(row.jobId)
    ElMessage.success('暂停成功')
    getList()
  } catch (error) {
    ElMessage.error('暂停失败')
  }
}

// 恢复任务
const handleResume = async (row: any) => {
  try {
    await resumeJob(row.jobId)
    ElMessage.success('恢复成功')
    getList()
  } catch (error) {
    ElMessage.error('恢复失败')
  }
}

// 立即执行
const handleRun = (row: any) => {
  ElMessageBox.confirm(`确认立即执行一次任务"${row.jobName}"吗?`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      await runJob(row.jobId)
      ElMessage.success('执行成功')
    } catch (error) {
      ElMessage.error('执行失败')
    }
  })
}

// 提交表单
const submitForm = () => {
  formRef.value.validate(async (valid: boolean) => {
    if (valid) {
      try {
        if (form.jobId) {
          await updateJob(form)
          ElMessage.success('修改成功')
        } else {
          await addJob(form)
          ElMessage.success('新增成功')
        }
        dialogVisible.value = false
        getList()
      } catch (error) {
        ElMessage.error(form.jobId ? '修改失败' : '新增失败')
      }
    }
  })
}

// 重置表单
const resetForm = () => {
  Object.assign(form, {
    jobId: undefined,
    jobName: '',
    jobGroup: 'DEFAULT',
    invokeTarget: '',
    cronExpression: '',
    misfirePolicy: '3',
    concurrent: '1',
    status: '0',
    remark: ''
  })
  formRef.value?.clearValidate()
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
        <el-form-item label="任务名称">
          <el-input
            v-model="queryParams.jobName"
            placeholder="请输入任务名称"
            clearable
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item label="任务组名">
          <el-input
            v-model="queryParams.jobGroup"
            placeholder="请输入任务组名"
            clearable
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item label="任务状态">
          <el-select v-model="queryParams.status" placeholder="任务状态" clearable>
            <el-option label="正常" value="0" />
            <el-option label="暂停" value="1" />
          </el-select>
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
          <span>任务列表</span>
          <el-button
            type="primary"
            :icon="Plus"
            @click="handleAdd"
            v-permission="['monitor:job:add']"
          >
            新增
          </el-button>
        </div>
      </template>

      <!-- 表格 -->
      <el-table v-loading="loading" :data="tableData" border stripe>
        <el-table-column label="任务编号" prop="jobId" width="80" />
        <el-table-column label="任务名称" prop="jobName" :show-overflow-tooltip="true" />
        <el-table-column label="任务组名" prop="jobGroup" width="120" />
        <el-table-column label="调用目标" prop="invokeTarget" :show-overflow-tooltip="true" />
        <el-table-column label="CRON表达式" prop="cronExpression" width="150" />
        <el-table-column label="状态" align="center" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === '0' ? 'success' : 'danger'">
              {{ row.status === '0' ? '正常' : '暂停' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="280" fixed="right">
          <template #default="{ row }">
            <el-button
              link
              type="primary"
              :icon="Edit"
              @click="handleUpdate(row)"
              v-permission="['monitor:job:edit']"
            >
              修改
            </el-button>
            <el-button
              link
              type="danger"
              :icon="Delete"
              @click="handleDelete(row)"
              v-permission="['monitor:job:remove']"
            >
              删除
            </el-button>
            <el-button
              v-if="row.status === '0'"
              link
              type="warning"
              :icon="VideoPause"
              @click="handlePause(row)"
              v-permission="['monitor:job:changeStatus']"
            >
              暂停
            </el-button>
            <el-button
              v-else
              link
              type="success"
              :icon="VideoPlay"
              @click="handleResume(row)"
              v-permission="['monitor:job:changeStatus']"
            >
              恢复
            </el-button>
            <el-button
              link
              type="info"
              @click="handleRun(row)"
              v-permission="['monitor:job:changeStatus']"
            >
              执行
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

    <!-- 新增/修改对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="700px"
      :close-on-click-modal="false"
    >
      <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="任务名称" prop="jobName">
              <el-input v-model="form.jobName" placeholder="请输入任务名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="任务组名">
              <el-input v-model="form.jobGroup" placeholder="请输入任务组名" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="调用目标" prop="invokeTarget">
          <el-input v-model="form.invokeTarget" placeholder="请输入调用目标（类全名）" />
        </el-form-item>
        <el-form-item label="CRON表达式" prop="cronExpression">
          <el-input v-model="form.cronExpression" placeholder="请输入CRON表达式">
            <template #append>
              <el-button>生成表达式</el-button>
            </template>
          </el-input>
        </el-form-item>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="执行策略">
              <el-select v-model="form.misfirePolicy" placeholder="请选择">
                <el-option label="立即执行" value="1" />
                <el-option label="执行一次" value="2" />
                <el-option label="放弃执行" value="3" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否并发">
              <el-radio-group v-model="form.concurrent">
                <el-radio label="0">允许</el-radio>
                <el-radio label="1">禁止</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="任务状态">
          <el-radio-group v-model="form.status">
            <el-radio label="0">正常</el-radio>
            <el-radio label="1">暂停</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="form.remark" type="textarea" placeholder="请输入备注" />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitForm">确定</el-button>
      </template>
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
