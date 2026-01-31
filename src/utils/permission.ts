import { useAuthStore } from '@/stores/auth'

/**
 * 检查是否有权限
 */
export function hasPermission(permission: string | string[]): boolean {
  const authStore = useAuthStore()
  const permissions = authStore.permissions

  if (permissions.includes('*:*:*')) {
    return true
  }

  if (typeof permission === 'string') {
    return permissions.includes(permission)
  }

  if (Array.isArray(permission)) {
    return permission.some((p) => permissions.includes(p))
  }

  return false
}

/**
 * 检查是否有角色
 */
export function hasRole(role: string | string[]): boolean {
  const authStore = useAuthStore()
  const roles = authStore.roles

  if (roles.includes('admin')) {
    return true
  }

  if (typeof role === 'string') {
    return roles.includes(role)
  }

  if (Array.isArray(role)) {
    return role.some((r) => roles.includes(r))
  }

  return false
}

/**
 * 检查是否有任意权限
 */
export function hasAnyPermission(permissions: string[]): boolean {
  return permissions.some((permission) => hasPermission(permission))
}

/**
 * 检查是否有所有权限
 */
export function hasAllPermissions(permissions: string[]): boolean {
  return permissions.every((permission) => hasPermission(permission))
}
