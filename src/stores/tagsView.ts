import { defineStore } from 'pinia'
import type { RouteLocationNormalizedLoaded } from 'vue-router'

export interface TagView {
  name?: string
  path: string
  title?: string
  meta?: any
  query?: any
  params?: any
  fullPath?: string
  affix?: boolean
}

export const useTagsViewStore = defineStore('tagsView', {
  state: () => ({
    visitedViews: [] as TagView[],
    cachedViews: [] as string[]
  }),

  getters: {
    visitedViewsCount: (state) => state.visitedViews.length
  },

  actions: {
    /**
     * 添加访问的视图
     */
    addView(view: RouteLocationNormalizedLoaded) {
      this.addVisitedView(view)
      this.addCachedView(view)
    },

    /**
     * 添加访问的视图
     */
    addVisitedView(view: RouteLocationNormalizedLoaded) {
      if (this.visitedViews.some((v) => v.path === view.path)) return

      const tagView: TagView = {
        name: view.name as string || '',
        path: view.path,
        title: view.meta?.title as string || 'no-name',
        meta: view.meta,
        query: view.query,
        params: view.params,
        fullPath: view.fullPath,
        affix: (view.meta?.affix as boolean) || false
      }

      this.visitedViews.push(tagView)
    },

    /**
     * 添加缓存的视图
     */
    addCachedView(view: RouteLocationNormalizedLoaded) {
      if (this.cachedViews.includes(view.name as string)) return
      if (!view.meta?.noCache) {
        this.cachedViews.push(view.name as string)
      }
    },

    /**
     * 删除视图
     */
    delView(view: TagView) {
      return new Promise((resolve) => {
        this.delVisitedView(view)
        this.delCachedView(view)
        resolve({
          visitedViews: [...this.visitedViews],
          cachedViews: [...this.cachedViews]
        })
      })
    },

    /**
     * 删除访问的视图
     */
    delVisitedView(view: TagView) {
      for (const [i, v] of this.visitedViews.entries()) {
        if (v.path === view.path) {
          this.visitedViews.splice(i, 1)
          break
        }
      }
    },

    /**
     * 删除缓存的视图
     */
    delCachedView(view: TagView) {
      return new Promise((resolve) => {
        const index = this.cachedViews.indexOf(view.name as string)
        if (index > -1) {
          this.cachedViews.splice(index, 1)
        }
        resolve([...this.cachedViews])
      })
    },

    /**
     * 删除其他视图
     */
    delOthersViews(view: TagView) {
      return new Promise((resolve) => {
        this.delOthersVisitedViews(view)
        this.delOthersCachedViews(view)
        resolve({
          visitedViews: [...this.visitedViews],
          cachedViews: [...this.cachedViews]
        })
      })
    },

    /**
     * 删除其他访问的视图
     */
    delOthersVisitedViews(view: TagView) {
      this.visitedViews = this.visitedViews.filter((v) => {
        return v.meta?.affix || v.path === view.path
      })
    },

    /**
     * 删除其他缓存的视图
     */
    delOthersCachedViews(view: TagView) {
      const index = this.cachedViews.indexOf(view.name as string)
      if (index > -1) {
        this.cachedViews = this.cachedViews.slice(index, index + 1)
      } else {
        this.cachedViews = []
      }
    },

    /**
     * 删除所有视图
     */
    delAllViews() {
      return new Promise((resolve) => {
        this.delAllVisitedViews()
        this.delAllCachedViews()
        resolve({
          visitedViews: [...this.visitedViews],
          cachedViews: [...this.cachedViews]
        })
      })
    },

    /**
     * 删除所有访问的视图
     */
    delAllVisitedViews() {
      this.visitedViews = this.visitedViews.filter((tag) => tag.meta?.affix)
    },

    /**
     * 删除所有缓存的视图
     */
    delAllCachedViews() {
      this.cachedViews = []
    },

    /**
     * 更新访问的视图
     */
    updateVisitedView(view: TagView) {
      for (let v of this.visitedViews) {
        if (v.path === view.path) {
          v = Object.assign(v, view)
          break
        }
      }
    }
  },

  persist: true
})
