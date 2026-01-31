import { ref } from 'vue'
import type { Ref } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormInstance } from 'element-plus'

interface FormOptions<T = any> {
  initData?: T
  addApi?: (data: T) => Promise<any>
  updateApi?: (data: T) => Promise<any>
  onSuccess?: () => void
}

/**
 * 表单相关的组合式函数
 */
export function useForm<T = any>(options: FormOptions<T>) {
  const { initData, addApi, updateApi, onSuccess } = options

  const dialogVisible = ref(false)
  const dialogTitle = ref('')
  const formRef: Ref<FormInstance | null> = ref(null)
  const formData: Ref<Partial<T>> = ref({ ...initData })
  const loading = ref(false)

  /**
   * 打开新增对话框
   */
  const handleAdd = () => {
    dialogTitle.value = '新增'
    formData.value = { ...initData }
    dialogVisible.value = true
  }

  /**
   * 打开编辑对话框
   */
  const handleEdit = (row: T) => {
    dialogTitle.value = '编辑'
    formData.value = { ...row }
    dialogVisible.value = true
  }

  /**
   * 关闭对话框
   */
  const handleClose = () => {
    dialogVisible.value = false
    formRef.value?.resetFields()
  }

  /**
   * 提交表单
   */
  const handleSubmit = async () => {
    if (!formRef.value) return

    await formRef.value.validate()

    loading.value = true
    try {
      const isEdit = !!(formData.value as any).id

      if (isEdit && updateApi) {
        await updateApi(formData.value as T)
        ElMessage.success('修改成功')
      } else if (!isEdit && addApi) {
        await addApi(formData.value as T)
        ElMessage.success('新增成功')
      }

      handleClose()
      onSuccess?.()
    } catch (error) {
      console.error('提交失败:', error)
    } finally {
      loading.value = false
    }
  }

  return {
    dialogVisible,
    dialogTitle,
    formRef,
    formData,
    loading,
    handleAdd,
    handleEdit,
    handleClose,
    handleSubmit
  }
}
