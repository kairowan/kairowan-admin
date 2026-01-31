<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { HomeFilled } from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()
const breadcrumbs = ref<any[]>([])

const getBreadcrumb = () => {
  let matched = route.matched.filter((item) => item.meta && item.meta.title)
  const first = matched[0]

  // 如果第一个不是首页，添加首页
  if (!first || first.path !== '/dashboard') {
    matched = [{ path: '/dashboard', meta: { title: '首页', icon: 'HomeFilled' } } as any].concat(matched)
  }

  breadcrumbs.value = matched.filter((item) => {
    return item.meta && item.meta.title && item.meta.breadcrumb !== false
  })
}

const handleLink = (item: any) => {
  const { redirect, path } = item
  if (redirect) {
    router.push(redirect)
    return
  }
  router.push(path)
}

watch(
  () => route.path,
  () => {
    getBreadcrumb()
  },
  { immediate: true }
)
</script>

<template>
  <el-breadcrumb class="app-breadcrumb" separator="/">
    <transition-group name="breadcrumb">
      <el-breadcrumb-item v-for="(item, index) in breadcrumbs" :key="item.path">
        <span
          v-if="index === breadcrumbs.length - 1"
          class="no-redirect"
        >
          {{ item.meta.title }}
        </span>
        <a v-else @click.prevent="handleLink(item)" class="breadcrumb-link">
          <el-icon v-if="index === 0" class="breadcrumb-icon">
            <HomeFilled />
          </el-icon>
          {{ item.meta.title }}
        </a>
      </el-breadcrumb-item>
    </transition-group>
  </el-breadcrumb>
</template>

<style scoped lang="scss">
.app-breadcrumb {
  display: inline-flex;
  align-items: center;
  font-size: 14px;
  line-height: 1;

  :deep(.el-breadcrumb__item) {
    .el-breadcrumb__inner {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      color: #606266;
      font-weight: 500;
      transition: all 0.3s;

      &.is-link,
      a {
        color: #606266;
        font-weight: 400;
        transition: all 0.3s;

        &:hover {
          color: #409eff;
        }
      }
    }

    &:last-child {
      .el-breadcrumb__inner {
        color: #303133;
        font-weight: 600;
      }
    }

    .el-breadcrumb__separator {
      color: #c0c4cc;
      margin: 0 8px;
    }
  }

  .breadcrumb-link {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    cursor: pointer;
    text-decoration: none;
    color: #606266;
    transition: all 0.3s;

    &:hover {
      color: #409eff;

      .breadcrumb-icon {
        transform: scale(1.1);
      }
    }
  }

  .breadcrumb-icon {
    font-size: 16px;
    transition: transform 0.3s;
  }

  .no-redirect {
    color: #97a8be;
    cursor: text;
  }
}

// 面包屑过渡动画
.breadcrumb-enter-active,
.breadcrumb-leave-active {
  transition: all 0.3s;
}

.breadcrumb-enter-from {
  opacity: 0;
  transform: translateX(10px);
}

.breadcrumb-leave-to {
  opacity: 0;
  transform: translateX(-10px);
}

.breadcrumb-move {
  transition: all 0.3s;
}

.breadcrumb-leave-active {
  position: absolute;
}
</style>
