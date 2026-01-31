import router from './index'
import { useAuthStore } from '@/stores/auth'
import { usePermissionStore } from '@/stores/permission'
import { asyncRoutes } from './routes'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

NProgress.configure({ showSpinner: false })

const whiteList = ['/login', '/404', '/401']

router.beforeEach(async (to, _from, next) => {
  NProgress.start()

  const authStore = useAuthStore()
  const permissionStore = usePermissionStore()

  if (authStore.token) {
    if (to.path === '/login') {
      next({ path: '/' })
      NProgress.done()
    } else {
      // 检查路由是否已生成
      if (!permissionStore.isRoutesGenerated) {
        try {
          // 获取用户信息
          if (!authStore.userInfo) {
            await authStore.getUserInfo()
          }

          // 尝试获取后端路由数据（失败不影响登录）
          try {
            await authStore.getRouters()
          } catch (error) {
            console.warn('Failed to get routers from backend, using static routes', error)
          }

          // 动态添加路由
          const accessRoutes = asyncRoutes

          // 添加路由到路由器
          accessRoutes.forEach(route => {
            router.addRoute(route)
          })

          // 标记路由已生成
          permissionStore.generateRoutes(authStore.routers)

          // 添加404路由（必须放在最后）
          router.addRoute({
            path: '/:pathMatch(.*)*',
            redirect: '/404',
            meta: { hidden: true }
          })

          // 重新导航到目标路由
          next({ ...to, replace: true })
        } catch (error) {
          console.error('Route generation error:', error)
          authStore.reset()
          permissionStore.resetRoutes()
          next('/login')
          NProgress.done()
        }
      } else {
        // 路由已生成，直接放行
        next()
      }
    }
  } else {
    if (whiteList.includes(to.path)) {
      next()
    } else {
      next('/login')
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  NProgress.done()
})

// 路由错误处理
router.onError((error) => {
  console.error('Router error:', error)
  NProgress.done()
})
