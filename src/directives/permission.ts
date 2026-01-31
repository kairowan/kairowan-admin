import type { Directive, DirectiveBinding } from 'vue'
import { hasPermission } from '@/utils/permission'

/**
 * 权限指令
 * 使用方式: v-permission="['system:user:add']"
 */
export const permission: Directive = {
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    const { value } = binding

    if (value && value instanceof Array && value.length > 0) {
      const permissionFlag = value
      const hasPermissions = hasPermission(permissionFlag)

      if (!hasPermissions) {
        el.style.display = 'none'
        // 或者直接移除元素
        // el.parentNode?.removeChild(el)
      }
    } else {
      throw new Error('需要传入权限标识，例如: v-permission="[\'system:user:add\']"')
    }
  }
}

export default permission
