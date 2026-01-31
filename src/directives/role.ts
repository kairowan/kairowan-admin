import type { Directive, DirectiveBinding } from 'vue'
import { hasRole } from '@/utils/permission'

/**
 * 角色指令
 * 使用方式: v-role="['admin']"
 */
export const role: Directive = {
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    const { value } = binding

    if (value && value instanceof Array && value.length > 0) {
      const roleFlag = value
      const hasRoles = hasRole(roleFlag)

      if (!hasRoles) {
        el.style.display = 'none'
        // 或者直接移除元素
        // el.parentNode?.removeChild(el)
      }
    } else {
      throw new Error('需要传入角色标识，例如: v-role="[\'admin\']"')
    }
  }
}

export default role
