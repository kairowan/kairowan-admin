import request from '@/utils/request'

// ==================== 代码生成器 ====================

/**
 * 获取所有表
 */
export function getTables() {
  return request({
    url: '/tool/gen/tables',
    method: 'get'
  })
}

/**
 * 获取表结构
 */
export function getTableStructure(tableName: string) {
  return request({
    url: `/tool/gen/table/${tableName}`,
    method: 'get'
  })
}

/**
 * 预览生成代码
 */
export function previewCode(tableName: string) {
  return request({
    url: `/tool/gen/preview/${tableName}`,
    method: 'get'
  })
}

/**
 * 生成代码并保存
 */
export function generateCode(tableName: string) {
  return request({
    url: `/tool/gen/generate/${tableName}`,
    method: 'post'
  })
}

// ==================== 文件管理 ====================

/**
 * 获取文件列表
 */
export function getFileList(params?: any) {
  return request({
    url: '/tool/file/list',
    method: 'get',
    params
  })
}

/**
 * 上传文件
 */
export function uploadFile(data: FormData) {
  return request({
    url: '/tool/file/upload',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

/**
 * 下载文件
 */
export function downloadFile(fileId: string) {
  return request({
    url: `/tool/file/download/${fileId}`,
    method: 'get',
    responseType: 'blob'
  })
}

/**
 * 删除文件
 */
export function deleteFile(fileId: string) {
  return request({
    url: `/tool/file/${fileId}`,
    method: 'delete'
  })
}

/**
 * 上传头像
 */
export function uploadAvatar(data: FormData) {
  return request({
    url: '/system/user/avatar',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}
