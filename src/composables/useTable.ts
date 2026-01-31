import { ref } from 'vue'
import type { Ref } from 'vue'
import { ElMessage } from 'element-plus'

interface TableOptions<T = any> {
  api: (params: any) => Promise<{ rows: T[]; total: number }>
  initParams?: Record<string, any>
  immediate?: boolean
}

/**
 * 表格相关的组合式函数
 */
export function useTable<T = any>(options: TableOptions<T>) {
  const { api, initParams = {}, immediate = true } = options

  const loading = ref(false)
  const tableData: Ref<T[]> = ref([])
  const total = ref(0)
  const queryParams = ref({
    pageNum: 1,
    pageSize: 10,
    ...initParams
  })

  /**
   * 获取列表数据
   */
  const getList = async () => {
    loading.value = true
    try {
      const data = await api(queryParams.value)
      tableData.value = data.rows
      total.value = data.total
    } catch (error) {
      ElMessage.error('获取数据失败')
      console.error('获取数据失败:', error)
    } finally {
      loading.value = false
    }
  }

  /**
   * 搜索
   */
  const handleSearch = () => {
    queryParams.value.pageNum = 1
    getList()
  }

  /**
   * 重置
   */
  const handleReset = () => {
    queryParams.value = {
      pageNum: 1,
      pageSize: 10,
      ...initParams
    }
    getList()
  }

  /**
   * 刷新
   */
  const handleRefresh = () => {
    getList()
  }

  /**
   * 页码改变
   */
  const handlePageChange = (page: number) => {
    queryParams.value.pageNum = page
    getList()
  }

  /**
   * 每页条数改变
   */
  const handleSizeChange = (size: number) => {
    queryParams.value.pageSize = size
    queryParams.value.pageNum = 1
    getList()
  }

  // 立即执行
  if (immediate) {
    getList()
  }

  return {
    loading,
    tableData,
    total,
    queryParams,
    getList,
    handleSearch,
    handleReset,
    handleRefresh,
    handlePageChange,
    handleSizeChange
  }
}
