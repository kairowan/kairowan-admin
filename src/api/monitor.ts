import request from '@/utils/request'

// ==================== 在线用户 ====================

/**
 * 获取在线用户列表
 */
export function getOnlineList(params?: any) {
  return request({
    url: '/monitor/online/list',
    method: 'get',
    params
  })
}

/**
 * 获取在线用户数量
 */
export function getOnlineCount() {
  return request({
    url: '/monitor/online/count',
    method: 'get'
  })
}

/**
 * 强制踢出用户
 */
export function forceLogout(tokenId: string) {
  return request({
    url: `/monitor/online/${tokenId}`,
    method: 'delete'
  })
}

// ==================== 定时任务 ====================

/**
 * 获取定时任务列表
 */
export function getJobList(params?: any) {
  return request({
    url: '/monitor/job/list',
    method: 'get',
    params
  })
}

/**
 * 获取任务详情
 */
export function getJob(jobId: number) {
  return request({
    url: `/monitor/job/${jobId}`,
    method: 'get'
  })
}

/**
 * 获取运行中的任务
 */
export function getRunningJobs() {
  return request({
    url: '/monitor/job/running',
    method: 'get'
  })
}

/**
 * 新增定时任务
 */
export function addJob(data: any) {
  return request({
    url: '/monitor/job',
    method: 'post',
    data
  })
}

/**
 * 修改定时任务
 */
export function updateJob(data: any) {
  return request({
    url: '/monitor/job',
    method: 'put',
    data
  })
}

/**
 * 删除定时任务
 */
export function delJob(jobId: number) {
  return request({
    url: `/monitor/job/${jobId}`,
    method: 'delete'
  })
}

/**
 * 暂停定时任务
 */
export function pauseJob(jobId: number) {
  return request({
    url: `/monitor/job/pause/${jobId}`,
    method: 'put'
  })
}

/**
 * 恢复定时任务
 */
export function resumeJob(jobId: number) {
  return request({
    url: `/monitor/job/resume/${jobId}`,
    method: 'put'
  })
}

/**
 * 立即执行一次
 */
export function runJob(jobId: number) {
  return request({
    url: `/monitor/job/run/${jobId}`,
    method: 'put'
  })
}

// ==================== 操作日志 ====================

/**
 * 获取操作日志列表
 */
export function getOperlogList(params?: any) {
  return request({
    url: '/monitor/operlog/list',
    method: 'get',
    params
  })
}

/**
 * 获取操作日志详情
 */
export function getOperlog(operId: number) {
  return request({
    url: `/monitor/operlog/${operId}`,
    method: 'get'
  })
}

/**
 * 删除操作日志
 */
export function delOperlog(operIds: number[]) {
  return request({
    url: '/monitor/operlog',
    method: 'delete',
    data: operIds
  })
}

/**
 * 清空操作日志
 */
export function cleanOperlog() {
  return request({
    url: '/monitor/operlog/clean',
    method: 'delete'
  })
}

/**
 * 导出操作日志
 */
export function exportOperlog(params?: any) {
  return request({
    url: '/monitor/operlog/export',
    method: 'get',
    params,
    responseType: 'blob'
  })
}

// ==================== 登录日志 ====================

/**
 * 获取登录日志列表
 */
export function getLoginlogList(params?: any) {
  return request({
    url: '/monitor/logininfor/list',
    method: 'get',
    params
  })
}

/**
 * 删除登录日志
 */
export function delLoginlog(infoIds: number[]) {
  return request({
    url: '/monitor/logininfor',
    method: 'delete',
    data: infoIds
  })
}

/**
 * 清空登录日志
 */
export function cleanLoginlog() {
  return request({
    url: '/monitor/logininfor/clean',
    method: 'delete'
  })
}

/**
 * 导出登录日志
 */
export function exportLoginlog(params?: any) {
  return request({
    url: '/monitor/logininfor/export',
    method: 'get',
    params,
    responseType: 'blob'
  })
}

// ==================== 服务监控 ====================

/**
 * 获取服务器监控信息
 */
export function getServerInfo() {
  return request({
    url: '/monitor/server',
    method: 'get'
  })
}

// ==================== 缓存监控 ====================

/**
 * 获取缓存统计信息
 */
export function getCacheStats() {
  return request({
    url: '/monitor/cache/stats',
    method: 'get'
  })
}

/**
 * 获取缓存大小
 */
export function getCacheSize() {
  return request({
    url: '/monitor/cache/size',
    method: 'get'
  })
}

/**
 * 清空缓存
 */
export function clearCache() {
  return request({
    url: '/monitor/cache/clear',
    method: 'post'
  })
}

/**
 * 获取缓存详细信息
 */
export function getCacheInfo() {
  return request({
    url: '/monitor/cache/info',
    method: 'get'
  })
}
