<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search, Plus, Edit, Delete, Refresh } from '@element-plus/icons-vue'
import { getDictTypeList, getDictDataByType, addDictType, updateDictType, delDictType, addDictData, updateDictData, delDictData, refreshDictCache } from '@/api/system'

// 当前选中的字典类型
const currentDictType = ref('')

// 字典类型查询参数
const typeQueryParams = reactive({
  pageNum: 1,
  pageSize: 10,
  dictName: '',
  dictType: '',
  status: ''
})

// 字典数据查询参数
const dataQueryParams = reactive({
  pageNum: 1,
  pageSize: 10,
  dictLabel: '',
  status: ''
})

// 字典类型表格数据
const typeLoading = ref(false)
const typeTableData = ref([])
const typeTotal = ref(0)

// 字典数据表格数据
const dataLoading = ref(false)
const dataTableData = ref([])

// 字典类型对话框
const typeDialogVisible = ref(false)
const typeDialogTitle = ref('')
const typeFormRef = ref()
const typeForm = reactive({
  dictId: undefined,
  dictName: '',
  dictType: '',
  status: '0',
  remark: ''
})

// 字典数据对话框
const dataDialogVisible = ref(false)
const dataDialogTitle = ref('')
const dataFormRef = ref()
const dataForm = reactive({
  dictCode: undefined,
  dictType: '',
  dictLabel: '',
  dictValue: '',
  dictSort: 0,
  cssClass: '',
  listClass: 'default',
  isDefault: 'N',
  status: '0',
  remark: ''
})

// 表单验证规则
const typeRules = {
  dictName: [
    { required: true, message: '请输入字典名称', trigger: 'blur' }
  ],
  dictType: [
    { required: true, message: '请输入字典类型', trigger: 'blur' }
  ]
}

const dataRules = {
  dictLabel: [
    { required: true, message: '请输入字典标签', trigger: 'blur' }
  ],
  dictValue: [
    { required: true, message: '请输入字典键值', trigger: 'blur' }
  ],
  dictSort: [
    { required: true, message: '请输入字典排序', trigger: 'blur' }
  ]
}

// 获取字典类型列表
const getTypeList = async () => {
  typeLoading.value = true
  try {
    const res = await getDictTypeList(typeQueryParams)
    typeTableData.value = res.rows
    typeTotal.value = res.total
  } catch (error) {
    ElMessage.error('获取字典类型列表失败')
  } finally {
    typeLoading.value = false
  }
}

// 获取字典数据列表
const getDataList = async () => {
  if (!currentDictType.value) {
    dataTableData.value = []
    return
  }
  dataLoading.value = true
  try {
    const res = await getDictDataByType(currentDictType.value)
    dataTableData.value = res.data
  } catch (error) {
    ElMessage.error('获取字典数据列表失败')
  } finally {
    dataLoading.value = false
  }
}

// 选择字典类型
const handleTypeClick = (row: any) => {
  currentDictType.value = row.dictType
  dataForm.dictType = row.dictType
  getDataList()
}

// 搜索字典类型
const handleTypeQuery = () => {
  typeQueryParams.pageNum = 1
  getTypeList()
}

// 重置字典类型搜索
const resetTypeQuery = () => {
  Object.assign(typeQueryParams, {
    pageNum: 1,
    pageSize: 10,
    dictName: '',
    dictType: '',
    status: ''
  })
  getTypeList()
}

// 新增字典类型
const handleAddType = () => {
  typeDialogTitle.value = '新增字典类型'
  resetTypeForm()
  typeDialogVisible.value = true
}

// 修改字典类型
const handleUpdateType = (row: any) => {
  typeDialogTitle.value = '修改字典类型'
  resetTypeForm()
  Object.assign(typeForm, row)
  typeDialogVisible.value = true
}

// 删除字典类型
const handleDeleteType = (row: any) => {
  ElMessageBox.confirm(`确认删除字典类型"${row.dictName}"吗?`, '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      await delDictType(row.dictId)
      ElMessage.success('删除成功')
      getTypeList()
      if (currentDictType.value === row.dictType) {
        currentDictType.value = ''
        dataTableData.value = []
      }
    } catch (error) {
      ElMessage.error('删除失败')
    }
  })
}

// 新增字典数据
const handleAddData = () => {
  if (!currentDictType.value) {
    ElMessage.warning('请先选择字典类型')
    return
  }
  dataDialogTitle.value = '新增字典数据'
  resetDataForm()
  dataForm.dictType = currentDictType.value
  dataDialogVisible.value = true
}

// 修改字典数据
const handleUpdateData = (row: any) => {
  dataDialogTitle.value = '修改字典数据'
  resetDataForm()
  Object.assign(dataForm, row)
  dataDialogVisible.value = true
}

// 删除字典数据
const handleDeleteData = (row: any) => {
  ElMessageBox.confirm(`确认删除字典数据"${row.dictLabel}"吗?`, '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      await delDictData(row.dictCode)
      ElMessage.success('删除成功')
      getDataList()
    } catch (error) {
      ElMessage.error('删除失败')
    }
  })
}

// 刷新缓存
const handleRefreshCache = async () => {
  try {
    await refreshDictCache()
    ElMessage.success('刷新缓存成功')
  } catch (error) {
    ElMessage.error('刷新缓存失败')
  }
}

// 提交字典类型表单
const submitTypeForm = () => {
  typeFormRef.value.validate(async (valid: boolean) => {
    if (valid) {
      try {
        if (typeForm.dictId) {
          await updateDictType(typeForm)
          ElMessage.success('修改成功')
        } else {
          await addDictType(typeForm)
          ElMessage.success('新增成功')
        }
        typeDialogVisible.value = false
        getTypeList()
      } catch (error) {
        ElMessage.error(typeForm.dictId ? '修改失败' : '新增失败')
      }
    }
  })
}

// 提交字典数据表单
const submitDataForm = () => {
  dataFormRef.value.validate(async (valid: boolean) => {
    if (valid) {
      try {
        if (dataForm.dictCode) {
          await updateDictData(dataForm)
          ElMessage.success('修改成功')
        } else {
          await addDictData(dataForm)
          ElMessage.success('新增成功')
        }
        dataDialogVisible.value = false
        getDataList()
      } catch (error) {
        ElMessage.error(dataForm.dictCode ? '修改失败' : '新增失败')
      }
    }
  })
}

// 重置字典类型表单
const resetTypeForm = () => {
  Object.assign(typeForm, {
    dictId: undefined,
    dictName: '',
    dictType: '',
    status: '0',
    remark: ''
  })
  typeFormRef.value?.clearValidate()
}

// 重置字典数据表单
const resetDataForm = () => {
  Object.assign(dataForm, {
    dictCode: undefined,
    dictType: currentDictType.value,
    dictLabel: '',
    dictValue: '',
    dictSort: 0,
    cssClass: '',
    listClass: 'default',
    isDefault: 'N',
    status: '0',
    remark: ''
  })
  dataFormRef.value?.clearValidate()
}

// 分页
const handleTypeSizeChange = (val: number) => {
  typeQueryParams.pageSize = val
  getTypeList()
}

const handleTypeCurrentChange = (val: number) => {
  typeQueryParams.pageNum = val
  getTypeList()
}

// 初始化
onMounted(() => {
  getTypeList()
})
</script>

<template>
  <div class="app-container">
    <el-row :gutter="20">
      <!-- 字典类型 -->
      <el-col :span="8">
        <el-card class="search-card" shadow="never">
          <el-form :model="typeQueryParams" inline>
            <el-form-item label="字典名称">
              <el-input
                v-model="typeQueryParams.dictName"
                placeholder="请输入字典名称"
                clearable
                style="width: 200px"
                @keyup.enter="handleTypeQuery"
              />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" :icon="Search" @click="handleTypeQuery">搜索</el-button>
              <el-button :icon="Refresh" @click="resetTypeQuery">重置</el-button>
            </el-form-item>
          </el-form>
        </el-card>

        <el-card class="table-card" shadow="never">
          <template #header>
            <div class="card-header">
              <span>字典类型</span>
              <div>
                <el-button
                  type="primary"
                  :icon="Plus"
                  @click="handleAddType"
                  v-permission="['system:dict:add']"
                >
                  新增
                </el-button>
                <el-button
                  type="success"
                  :icon="Refresh"
                  @click="handleRefreshCache"
                  v-permission="['system:dict:remove']"
                >
                  刷新缓存
                </el-button>
              </div>
            </div>
          </template>

          <el-table
            v-loading="typeLoading"
            :data="typeTableData"
            border
            stripe
            highlight-current-row
            @row-click="handleTypeClick"
          >
            <el-table-column label="字典名称" prop="dictName" :show-overflow-tooltip="true" />
            <el-table-column label="字典类型" prop="dictType" :show-overflow-tooltip="true" />
            <el-table-column label="状态" align="center" width="80">
              <template #default="{ row }">
                <el-tag :type="row.status === '0' ? 'success' : 'danger'">
                  {{ row.status === '0' ? '正常' : '停用' }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center" width="150">
              <template #default="{ row }">
                <el-button
                  link
                  type="primary"
                  :icon="Edit"
                  @click.stop="handleUpdateType(row)"
                  v-permission="['system:dict:edit']"
                >
                  修改
                </el-button>
                <el-button
                  link
                  type="danger"
                  :icon="Delete"
                  @click.stop="handleDeleteType(row)"
                  v-permission="['system:dict:remove']"
                >
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>

          <el-pagination
            v-model:current-page="typeQueryParams.pageNum"
            v-model:page-size="typeQueryParams.pageSize"
            :total="typeTotal"
            :page-sizes="[10, 20, 50, 100]"
            layout="total, sizes, prev, pager, next"
            @size-change="handleTypeSizeChange"
            @current-change="handleTypeCurrentChange"
          />
        </el-card>
      </el-col>

      <!-- 字典数据 -->
      <el-col :span="16">
        <el-card class="table-card" shadow="never">
          <template #header>
            <div class="card-header">
              <span>字典数据 {{ currentDictType ? `(${currentDictType})` : '' }}</span>
              <el-button
                type="primary"
                :icon="Plus"
                @click="handleAddData"
                :disabled="!currentDictType"
                v-permission="['system:dict:add']"
              >
                新增
              </el-button>
            </div>
          </template>

          <el-table v-loading="dataLoading" :data="dataTableData" border stripe>
            <el-table-column label="字典标签" prop="dictLabel" :show-overflow-tooltip="true" />
            <el-table-column label="字典键值" prop="dictValue" :show-overflow-tooltip="true" />
            <el-table-column label="字典排序" prop="dictSort" width="100" />
            <el-table-column label="状态" align="center" width="80">
              <template #default="{ row }">
                <el-tag :type="row.status === '0' ? 'success' : 'danger'">
                  {{ row.status === '0' ? '正常' : '停用' }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="备注" prop="remark" :show-overflow-tooltip="true" />
            <el-table-column label="创建时间" prop="createTime" width="160" />
            <el-table-column label="操作" align="center" width="150" fixed="right">
              <template #default="{ row }">
                <el-button
                  link
                  type="primary"
                  :icon="Edit"
                  @click="handleUpdateData(row)"
                  v-permission="['system:dict:edit']"
                >
                  修改
                </el-button>
                <el-button
                  link
                  type="danger"
                  :icon="Delete"
                  @click="handleDeleteData(row)"
                  v-permission="['system:dict:remove']"
                >
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>

    <!-- 字典类型对话框 -->
    <el-dialog
      v-model="typeDialogVisible"
      :title="typeDialogTitle"
      width="600px"
      :close-on-click-modal="false"
    >
      <el-form ref="typeFormRef" :model="typeForm" :rules="typeRules" label-width="80px">
        <el-form-item label="字典名称" prop="dictName">
          <el-input v-model="typeForm.dictName" placeholder="请输入字典名称" />
        </el-form-item>
        <el-form-item label="字典类型" prop="dictType">
          <el-input v-model="typeForm.dictType" placeholder="请输入字典类型" />
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="typeForm.status">
            <el-radio label="0">正常</el-radio>
            <el-radio label="1">停用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="typeForm.remark" type="textarea" placeholder="请输入备注" />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="typeDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitTypeForm">确定</el-button>
      </template>
    </el-dialog>

    <!-- 字典数据对话框 -->
    <el-dialog
      v-model="dataDialogVisible"
      :title="dataDialogTitle"
      width="600px"
      :close-on-click-modal="false"
    >
      <el-form ref="dataFormRef" :model="dataForm" :rules="dataRules" label-width="100px">
        <el-form-item label="字典类型">
          <el-input v-model="dataForm.dictType" disabled />
        </el-form-item>
        <el-form-item label="数据标签" prop="dictLabel">
          <el-input v-model="dataForm.dictLabel" placeholder="请输入数据标签" />
        </el-form-item>
        <el-form-item label="数据键值" prop="dictValue">
          <el-input v-model="dataForm.dictValue" placeholder="请输入数据键值" />
        </el-form-item>
        <el-form-item label="显示排序" prop="dictSort">
          <el-input-number v-model="dataForm.dictSort" :min="0" controls-position="right" />
        </el-form-item>
        <el-form-item label="样式属性">
          <el-input v-model="dataForm.cssClass" placeholder="请输入样式属性" />
        </el-form-item>
        <el-form-item label="回显样式">
          <el-select v-model="dataForm.listClass" placeholder="请选择">
            <el-option label="默认" value="default" />
            <el-option label="主要" value="primary" />
            <el-option label="成功" value="success" />
            <el-option label="信息" value="info" />
            <el-option label="警告" value="warning" />
            <el-option label="危险" value="danger" />
          </el-select>
        </el-form-item>
        <el-form-item label="是否默认">
          <el-radio-group v-model="dataForm.isDefault">
            <el-radio label="Y">是</el-radio>
            <el-radio label="N">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="dataForm.status">
            <el-radio label="0">正常</el-radio>
            <el-radio label="1">停用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="dataForm.remark" type="textarea" placeholder="请输入备注" />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="dataDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitDataForm">确定</el-button>
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
