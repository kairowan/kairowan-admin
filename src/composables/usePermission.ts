import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'

/**
 * 权限相关的组合式函数
 */
export function usePermission() {
  const authStore = useAuthStore()

  const permissions = computed(() => authStore.permissions)
  const roles = computed(() => authStore.roles)

  /**
   * 检查是否有权限
   */
  const hasPermission = (permission: string | string[]): boolean => {
    if (permissions.value.includes('*:*:*')) {
      return true
    }

    if (typeof permission === 'string') {
      return permissions.value.includes(permission)
    }

    if (Array.isArray(permission)) {
      return permission.some((p) => permissions.value.includes(p))
    }

    return false
  }

  /**
   * 检查是否有角色
   */
  const hasRole = (role: string | string[]): boolean => {
    if (roles.value.includes('admin')) {
      return true
    }

    if (typeof role === 'string') {
      return roles.value.includes(role)
    }

    if (Array.isArray(role)) {
      return role.some((r) => roles.value.includes(r))
    }

    return false
  }

  /**
   * 检查是否有任意权限
   */
  const hasAnyPermission = (perms: string[]): boolean => {
    return perms.some((p) => hasPermission(p))
  }

  /**
   * 检查是否有所有权限
   */
  const hasAllPermissions = (perms: string[]): boolean => {
    return perms.every((p) => hasPermission(p))
  }

  return {
    permissions,
    roles,
    hasPermission,
    hasRole,
    hasAnyPermission,
    hasAllPermissions
  }
}
