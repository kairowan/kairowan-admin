/**
 * 通用 API 响应结构（对应后端 KResult）
 */
export interface ApiResponse<T = any> {
  code: number
  msg: string
  data: T
}

/**
 * 分页响应（对应后端 KTableData）
 */
export interface PageResponse<T = any> {
  rows: T[]
  total: number
}

/**
 * 分页请求参数
 */
export interface PageQuery {
  pageNum: number
  pageSize: number
}

/**
 * 登录参数
 */
export interface LoginParams {
  username: string
  password: string
  code: string
  uuid: string
}

/**
 * 登录结果
 */
export interface LoginResult {
  token: string
}

/**
 * 用户信息
 */
export interface UserInfo {
  userId: number
  userName: string
  nickName: string
  email: string
  phone: string
  sex: string
  avatar: string
  deptId: number
  status: string
  roles: string[]
  permissions: string[]
}

/**
 * 路由菜单
 */
export interface RouterMenu {
  name: string
  path: string
  component: string
  meta: {
    title: string
    icon: string
    noCache: boolean
  }
  children?: RouterMenu[]
}

/**
 * 验证码
 */
export interface CaptchaResult {
  uuid: string
  img: string
}
