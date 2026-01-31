import request from '@/utils/request'
import type { User, UserQuery, UserForm } from '@/types/user'
import type { PageResponse } from '@/types/api'

/**
 * 获取用户列表
 */
export function getUserList(params: UserQuery) {
  return request<PageResponse<User>>({
    url: '/system/user/list',
    method: 'get',
    params
  })
}

/**
 * 获取用户详情
 */
export function getUserDetail(userId: number) {
  return request<User>({
    url: `/system/user/${userId}`,
    method: 'get'
  })
}

/**
 * 新增用户
 */
export function addUser(data: UserForm) {
  return request({
    url: '/system/user/add',
    method: 'post',
    data
  })
}

/**
 * 修改用户
 */
export function updateUser(data: UserForm) {
  return request({
    url: '/system/user/update',
    method: 'put',
    data
  })
}

/**
 * 删除用户
 */
export function deleteUser(userId: number) {
  return request({
    url: `/system/user/${userId}`,
    method: 'delete'
  })
}

/**
 * 导出用户
 */
export function exportUser(params: UserQuery) {
  return request({
    url: '/system/user/export',
    method: 'get',
    params,
    responseType: 'blob'
  })
}

/**
 * 重置密码
 */
export function resetPassword(userId: number, password: string) {
  return request({
    url: '/system/user/resetPwd',
    method: 'put',
    data: { userId, password }
  })
}
