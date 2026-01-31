<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { Search, Refresh, View, Download } from '@element-plus/icons-vue'
import { getTables, getTableStructure, previewCode, generateCode } from '@/api/tool'

// 查询参数
const queryParams = reactive({
  tableName: ''
})

// 表格数据
const loading = ref(false)
const tableData = ref([])

// 预览对话框
const previewVisible = ref(false)
const previewData = ref<any>({})
const activeTab = ref('entity')

// 获取表列表
const getList = async () => {
  loading.value = true
  try {
    const res = await getTables()
    tableData.value = res.data
  } catch (error) {
    ElMessage.error('获取表列表失败')
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
  queryParams.tableName = ''
  getList()
}

// 预览代码
const handlePreview = async (row: any) => {
  try {
    const res = await previewCode(row.tableName)
    previewData.value = res.data
    previewVisible.value = true
  } catch (error) {
    ElMessage.error('预览失败')
  }
}

// 生成代码
const handleGenerate = async (row: any) => {
  try {
    await generateCode(row.tableName)
    ElMessage.success('生成成功')
  } catch (error) {
    ElMessage.error('生成失败')
  }
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
        <el-form-item label="表名称">
          <el-input
            v-model="queryParams.tableName"
            placeholder="请输入表名称"
            clearable
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :icon="Search" @click="handleQuery">搜索</el-button>
          <el-button :icon="Refresh" @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 表格 -->
    <el-card class="table-card" shadow="never">
      <template #header>
        <span>数据库表列表</span>
      </template>

      <el-table v-loading="loading" :data="tableData" border stripe>
        <el-table-column label="序号" type="index" width="60" />
        <el-table-column label="表名称" prop="tableName" :show-overflow-tooltip="true" />
        <el-table-column label="表注释" prop="tableComment" :show-overflow-tooltip="true" />
        <el-table-column label="创建时间" prop="createTime" width="160" />
        <el-table-column label="更新时间" prop="updateTime" width="160" />
        <el-table-column label="操作" align="center" width="200" fixed="right">
          <template #default="{ row }">
            <el-button
              link
              type="primary"
              :icon="View"
              @click="handlePreview(row)"
            >
              预览
            </el-button>
            <el-button
              link
              type="success"
              :icon="Download"
              @click="handleGenerate(row)"
              v-permission="['tool:gen:code']"
            >
              生成代码
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 预览对话框 -->
    <el-dialog v-model="previewVisible" title="代码预览" width="80%" top="5vh">
      <el-tabs v-model="activeTab">
        <el-tab-pane label="Entity" name="entity">
          <el-input
            v-model="previewData.entity"
            type="textarea"
            :rows="20"
            readonly
          />
        </el-tab-pane>
        <el-tab-pane label="Service" name="service">
          <el-input
            v-model="previewData.service"
            type="textarea"
            :rows="20"
            readonly
          />
        </el-tab-pane>
        <el-tab-pane label="Controller" name="controller">
          <el-input
            v-model="previewData.controller"
            type="textarea"
            :rows="20"
            readonly
          />
        </el-tab-pane>
      </el-tabs>
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
    .el-pagination {
      margin-top: 20px;
      justify-content: flex-end;
    }
  }
}
</style>
