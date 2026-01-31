<script setup lang="ts">
import { ref, watch, computed, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useTagsViewStore } from '@/stores/tagsView'
import { Close, Refresh, CloseBold } from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()
const tagsViewStore = useTagsViewStore()

const scrollContainer = ref<HTMLElement>()
const contextMenuVisible = ref(false)
const contextMenuLeft = ref(0)
const contextMenuTop = ref(0)
const selectedTag = ref<any>(null)

const visitedViews = computed(() => tagsViewStore.visitedViews)
const isActive = (tag: any) => tag.path === route.path

// 添加标签
const addTags = () => {
  if (route.name && !route.meta?.hidden) {
    tagsViewStore.addView(route)
  }
}

// 关闭标签
const closeSelectedTag = (view: any) => {
  tagsViewStore.delView(view).then(({ visitedViews }) => {
    if (isActive(view)) {
      toLastView(visitedViews, view)
    }
  })
}

// 跳转到最后一个标签
const toLastView = (visitedViews: any[], view: any) => {
  const latestView = visitedViews.slice(-1)[0]
  if (latestView) {
    router.push(latestView.path)
  } else {
    router.push('/')
  }
}

// 刷新当前标签
const refreshSelectedTag = (view: any) => {
  tagsViewStore.delCachedView(view).then(() => {
    nextTick(() => {
      router.replace({
        path: '/redirect' + view.path,
        query: view.query
      })
    })
  })
}

// 关闭其他标签
const closeOthersTags = () => {
  if (selectedTag.value) {
    router.push(selectedTag.value.path)
    tagsViewStore.delOthersViews(selectedTag.value)
  }
  closeMenu()
}

// 关闭所有标签
const closeAllTags = () => {
  tagsViewStore.delAllViews().then(({ visitedViews }) => {
    toLastView(visitedViews, selectedTag.value)
  })
  closeMenu()
}

// 打开右键菜单
const openMenu = (tag: any, e: MouseEvent) => {
  const menuMinWidth = 105
  const offsetLeft = scrollContainer.value?.getBoundingClientRect().left || 0
  const offsetWidth = scrollContainer.value?.offsetWidth || 0
  const maxLeft = offsetWidth - menuMinWidth
  const left = e.clientX - offsetLeft + 15

  if (left > maxLeft) {
    contextMenuLeft.value = maxLeft
  } else {
    contextMenuLeft.value = left
  }

  contextMenuTop.value = e.clientY - 50
  contextMenuVisible.value = true
  selectedTag.value = tag
}

// 关闭右键菜单
const closeMenu = () => {
  contextMenuVisible.value = false
}

watch(
  () => route.path,
  () => {
    addTags()
  },
  { immediate: true }
)

watch(contextMenuVisible, (value) => {
  if (value) {
    document.body.addEventListener('click', closeMenu)
  } else {
    document.body.removeEventListener('click', closeMenu)
  }
})
</script>

<template>
  <div class="tags-view-container" ref="scrollContainer">
    <div class="tags-view-wrapper">
      <router-link
        v-for="tag in visitedViews"
        :key="tag.path"
        :to="{ path: tag.path, query: tag.query }"
        :class="['tags-view-item', isActive(tag) ? 'active' : '']"
        @contextmenu.prevent="openMenu(tag, $event)"
      >
        <span class="tag-title">{{ tag.meta?.title }}</span>
        <el-icon
          v-if="!tag.meta?.affix"
          class="tag-close"
          @click.prevent.stop="closeSelectedTag(tag)"
        >
          <Close />
        </el-icon>
      </router-link>
    </div>

    <!-- 右键菜单 -->
    <transition name="el-zoom-in-top">
      <ul
        v-show="contextMenuVisible"
        :style="{ left: contextMenuLeft + 'px', top: contextMenuTop + 'px' }"
        class="contextmenu"
      >
        <li @click="refreshSelectedTag(selectedTag)">
          <el-icon><Refresh /></el-icon>
          刷新页面
        </li>
        <li v-if="!selectedTag?.meta?.affix" @click="closeSelectedTag(selectedTag)">
          <el-icon><Close /></el-icon>
          关闭当前
        </li>
        <li @click="closeOthersTags">
          <el-icon><CloseBold /></el-icon>
          关闭其他
        </li>
        <li @click="closeAllTags">
          <el-icon><CloseBold /></el-icon>
          关闭所有
        </li>
      </ul>
    </transition>
  </div>
</template>

<style scoped lang="scss">
.tags-view-container {
  height: 40px;
  width: 100%;
  background: #fff;
  border-bottom: 1px solid #e8eaec;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
  position: relative;
  z-index: 9;

  .tags-view-wrapper {
    display: flex;
    align-items: center;
    height: 100%;
    padding: 0 12px;
    gap: 6px;
    overflow-x: auto;

    &::-webkit-scrollbar {
      height: 0;
    }

    .tags-view-item {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      height: 28px;
      padding: 0 12px;
      font-size: 13px;
      color: #606266;
      background: #f4f4f5;
      border: 1px solid #e4e7ed;
      border-radius: 4px;
      text-decoration: none;
      cursor: pointer;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      white-space: nowrap;
      position: relative;

      &:hover {
        background: #e8f4ff;
        border-color: #b3d8ff;
        color: #409eff;

        .tag-close {
          opacity: 1;
        }
      }

      &.active {
        background: linear-gradient(135deg, #409eff 0%, #66b1ff 100%);
        border-color: #409eff;
        color: #fff;
        box-shadow: 0 2px 8px rgba(64, 158, 255, 0.3);

        &::before {
          content: '';
          position: absolute;
          left: 8px;
          top: 50%;
          transform: translateY(-50%);
          width: 6px;
          height: 6px;
          background: #fff;
          border-radius: 50%;
          animation: pulse-dot 2s ease-in-out infinite;
        }

        .tag-title {
          margin-left: 8px;
        }

        .tag-close {
          opacity: 1;
          color: #fff;

          &:hover {
            background: rgba(255, 255, 255, 0.2);
          }
        }
      }

      .tag-title {
        font-weight: 500;
      }

      .tag-close {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 16px;
        height: 16px;
        border-radius: 50%;
        opacity: 0.7;
        transition: all 0.3s;

        &:hover {
          background: rgba(0, 0, 0, 0.1);
          opacity: 1;
        }
      }
    }
  }

  .contextmenu {
    margin: 0;
    background: #fff;
    z-index: 3000;
    position: absolute;
    list-style-type: none;
    padding: 8px 0;
    border-radius: 6px;
    font-size: 13px;
    font-weight: 400;
    color: #333;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.15);

    li {
      display: flex;
      align-items: center;
      gap: 8px;
      margin: 0;
      padding: 8px 16px;
      cursor: pointer;
      transition: all 0.3s;

      &:hover {
        background: #f5f7fa;
        color: #409eff;
      }

      .el-icon {
        font-size: 14px;
      }
    }
  }
}

@keyframes pulse-dot {
  0%, 100% {
    opacity: 1;
    transform: translateY(-50%) scale(1);
  }
  50% {
    opacity: 0.6;
    transform: translateY(-50%) scale(1.2);
  }
}
</style>
