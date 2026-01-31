import request from '@/utils/request'

// ==================== 通知管理 ====================

/**
 * 获取通知列表
 */
export function getNotificationList(params?: any) {
  return request({
    url: '/system/notification/list',
    method: 'get',
    params
  })
}

/**
 * 标记单条已读
 */
export function markNotificationRead(id: number) {
  return request({
    url: `/system/notification/read/${id}`,
    method: 'put'
  })
}

/**
 * 批量标记已读
 */
export function markNotificationsRead(ids: number[]) {
  return request({
    url: '/system/notification/read',
    method: 'put',
    data: { ids }
  })
}

/**
 * 全部标记已读
 */
export function markAllNotificationsRead() {
  return request({
    url: '/system/notification/read/all',
    method: 'put'
  })
}

/**
 * 删除单条通知
 */
export function deleteNotification(id: number) {
  return request({
    url: `/system/notification/${id}`,
    method: 'delete'
  })
}

/**
 * 批量删除通知
 */
export function deleteNotifications(ids: number[]) {
  return request({
    url: '/system/notification',
    method: 'delete',
    data: { ids }
  })
}
