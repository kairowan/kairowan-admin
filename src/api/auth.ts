import request from '@/utils/request'
import type { LoginParams, LoginResult, UserInfo, RouterMenu, CaptchaResult } from '@/types/api'

/**
 * 登录
 */
export function login(data: LoginParams) {
  return request<LoginResult>({
    url: '/auth/login',
    method: 'post',
    data
  })
}

/**
 * 登出
 */
export function logout() {
  return request({
    url: '/auth/logout',
    method: 'post'
  })
}

/**
 * 获取用户信息
 */
export function getUserInfo() {
  return request<UserInfo>({
    url: '/auth/getInfo',
    method: 'get'
  })
}

/**
 * 获取路由菜单
 */
export function getRouters() {
  return request<RouterMenu[]>({
    url: '/auth/getRouters',
    method: 'get'
  })
}

/**
 * 获取验证码
 */
export function getCaptcha() {
  return request<CaptchaResult>({
    url: '/captcha',
    method: 'get'
  })
}
