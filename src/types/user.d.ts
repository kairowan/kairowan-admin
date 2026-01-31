import type { PageQuery } from './api'

/**
 * 用户信息
 */
export interface User {
  userId: number
  userName: string
  nickName: string
  email: string
  phone: string
  sex: string
  avatar: string
  deptId: number
  postIds: number[]
  roleIds: number[]
  status: string
  remark: string
  createTime: string
  updateTime: string
}

/**
 * 用户查询参数
 */
export interface UserQuery extends PageQuery {
  userName?: string
  phone?: string
  status?: string
  deptId?: number
  startTime?: string
  endTime?: string
}

/**
 * 用户表单
 */
export interface UserForm {
  userId?: number
  userName: string
  nickName: string
  password?: string
  email: string
  phone: string
  sex: string
  deptId: number
  postIds: number[]
  roleIds: number[]
  status: string
  remark?: string
}
