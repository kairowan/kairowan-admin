import request from '@/utils/request'

// ==================== 用户管理 ====================

/**
 * 获取用户列表
 */
export function getUserList(params?: any) {
  return request({
    url: '/system/user/list',
    method: 'get',
    params
  })
}

/**
 * 获取用户详情
 */
export function getUser(userId: number) {
  return request({
    url: `/system/user/${userId}`,
    method: 'get'
  })
}

/**
 * 新增用户
 */
export function addUser(data: any) {
  return request({
    url: '/system/user',
    method: 'post',
    data
  })
}

/**
 * 修改用户
 */
export function updateUser(data: any) {
  return request({
    url: '/system/user',
    method: 'put',
    data
  })
}

/**
 * 删除用户
 */
export function delUser(userId: number) {
  return request({
    url: `/system/user/${userId}`,
    method: 'delete'
  })
}

/**
 * 重置用户密码
 */
export function resetUserPwd(userId: number, password: string) {
  return request({
    url: '/system/user/resetPwd',
    method: 'put',
    data: { userId, password }
  })
}

/**
 * 导出用户
 */
export function exportUser(params?: any) {
  return request({
    url: '/system/user/export',
    method: 'get',
    params,
    responseType: 'blob'
  })
}

// ==================== 角色管理 ====================

/**
 * 获取角色列表
 */
export function getRoleList(params?: any) {
  return request({
    url: '/system/role/list',
    method: 'get',
    params
  })
}

/**
 * 获取角色详情
 */
export function getRole(roleId: number) {
  return request({
    url: `/system/role/${roleId}`,
    method: 'get'
  })
}

/**
 * 新增角色
 */
export function addRole(data: any) {
  return request({
    url: '/system/role',
    method: 'post',
    data
  })
}

/**
 * 修改角色
 */
export function updateRole(data: any) {
  return request({
    url: '/system/role',
    method: 'put',
    data
  })
}

/**
 * 删除角色
 */
export function delRole(roleId: number) {
  return request({
    url: `/system/role/${roleId}`,
    method: 'delete'
  })
}

/**
 * 修改角色状态
 */
export function changeRoleStatus(roleId: number, status: string) {
  return request({
    url: '/system/role/changeStatus',
    method: 'put',
    data: { roleId, status }
  })
}

// ==================== 菜单管理 ====================

/**
 * 获取菜单列表
 */
export function getMenuList(params?: any) {
  return request({
    url: '/system/menu/list',
    method: 'get',
    params
  })
}

/**
 * 获取菜单详情
 */
export function getMenu(menuId: number) {
  return request({
    url: `/system/menu/${menuId}`,
    method: 'get'
  })
}

/**
 * 新增菜单
 */
export function addMenu(data: any) {
  return request({
    url: '/system/menu',
    method: 'post',
    data
  })
}

/**
 * 修改菜单
 */
export function updateMenu(data: any) {
  return request({
    url: '/system/menu',
    method: 'put',
    data
  })
}

/**
 * 删除菜单
 */
export function delMenu(menuId: number) {
  return request({
    url: `/system/menu/${menuId}`,
    method: 'delete'
  })
}

/**
 * 获取菜单树形选择器
 */
export function getMenuTreeselect() {
  return request({
    url: '/system/menu/treeselect',
    method: 'get'
  })
}

// ==================== 部门管理 ====================

/**
 * 获取部门列表
 */
export function getDeptList(params?: any) {
  return request({
    url: '/system/dept/list',
    method: 'get',
    params
  })
}

/**
 * 获取部门详情
 */
export function getDept(deptId: number) {
  return request({
    url: `/system/dept/${deptId}`,
    method: 'get'
  })
}

/**
 * 新增部门
 */
export function addDept(data: any) {
  return request({
    url: '/system/dept',
    method: 'post',
    data
  })
}

/**
 * 修改部门
 */
export function updateDept(data: any) {
  return request({
    url: '/system/dept',
    method: 'put',
    data
  })
}

/**
 * 删除部门
 */
export function delDept(deptId: number) {
  return request({
    url: `/system/dept/${deptId}`,
    method: 'delete'
  })
}

/**
 * 获取部门树形选择器
 */
export function getDeptTreeselect() {
  return request({
    url: '/system/dept/treeselect',
    method: 'get'
  })
}

// ==================== 岗位管理 ====================

/**
 * 获取岗位列表
 */
export function getPostList(params?: any) {
  return request({
    url: '/system/post/list',
    method: 'get',
    params
  })
}

/**
 * 获取岗位详情
 */
export function getPost(postId: number) {
  return request({
    url: `/system/post/${postId}`,
    method: 'get'
  })
}

/**
 * 新增岗位
 */
export function addPost(data: any) {
  return request({
    url: '/system/post',
    method: 'post',
    data
  })
}

/**
 * 修改岗位
 */
export function updatePost(data: any) {
  return request({
    url: '/system/post',
    method: 'put',
    data
  })
}

/**
 * 删除岗位
 */
export function delPost(postId: number) {
  return request({
    url: `/system/post/${postId}`,
    method: 'delete'
  })
}

/**
 * 获取岗位下拉列表
 */
export function getPostOptionselect() {
  return request({
    url: '/system/post/optionselect',
    method: 'get'
  })
}

// ==================== 字典管理 ====================

/**
 * 获取字典类型列表
 */
export function getDictTypeList(params?: any) {
  return request({
    url: '/system/dict/type/list',
    method: 'get',
    params
  })
}

/**
 * 获取字典类型详情
 */
export function getDictType(dictId: number) {
  return request({
    url: `/system/dict/type/${dictId}`,
    method: 'get'
  })
}

/**
 * 新增字典类型
 */
export function addDictType(data: any) {
  return request({
    url: '/system/dict/type',
    method: 'post',
    data
  })
}

/**
 * 修改字典类型
 */
export function updateDictType(data: any) {
  return request({
    url: '/system/dict/type',
    method: 'put',
    data
  })
}

/**
 * 删除字典类型
 */
export function delDictType(dictId: number) {
  return request({
    url: `/system/dict/type/${dictId}`,
    method: 'delete'
  })
}

/**
 * 根据字典类型获取字典数据
 */
export function getDictDataByType(dictType: string) {
  return request({
    url: `/system/dict/data/type/${dictType}`,
    method: 'get'
  })
}

/**
 * 获取字典数据列表
 */
export function getDictDataList(params?: any) {
  return request({
    url: '/system/dict/data/list',
    method: 'get',
    params
  })
}

/**
 * 获取字典数据详情
 */
export function getDictData(dictCode: number) {
  return request({
    url: `/system/dict/data/${dictCode}`,
    method: 'get'
  })
}

/**
 * 新增字典数据
 */
export function addDictData(data: any) {
  return request({
    url: '/system/dict/data',
    method: 'post',
    data
  })
}

/**
 * 修改字典数据
 */
export function updateDictData(data: any) {
  return request({
    url: '/system/dict/data',
    method: 'put',
    data
  })
}

/**
 * 删除字典数据
 */
export function delDictData(dictCode: number) {
  return request({
    url: `/system/dict/data/${dictCode}`,
    method: 'delete'
  })
}

/**
 * 刷新字典缓存
 */
export function refreshDictCache() {
  return request({
    url: '/system/dict/refreshCache',
    method: 'get'
  })
}

// ==================== 系统配置 ====================

/**
 * 获取配置列表
 */
export function getConfigList(params?: any) {
  return request({
    url: '/system/config/list',
    method: 'get',
    params
  })
}

/**
 * 获取配置详情
 */
export function getConfig(configId: number) {
  return request({
    url: `/system/config/${configId}`,
    method: 'get'
  })
}

/**
 * 根据键名获取配置值
 */
export function getConfigByKey(configKey: string) {
  return request({
    url: `/system/config/configKey/${configKey}`,
    method: 'get'
  })
}

/**
 * 新增配置
 */
export function addConfig(data: any) {
  return request({
    url: '/system/config',
    method: 'post',
    data
  })
}

/**
 * 修改配置
 */
export function updateConfig(data: any) {
  return request({
    url: '/system/config',
    method: 'put',
    data
  })
}

/**
 * 删除配置
 */
export function delConfig(configId: number) {
  return request({
    url: `/system/config/${configId}`,
    method: 'delete'
  })
}

/**
 * 刷新配置缓存
 */
export function refreshConfigCache() {
  return request({
    url: '/system/config/refreshCache',
    method: 'get'
  })
}
