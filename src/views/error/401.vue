<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const goBack = () => {
  router.back()
}

const goHome = () => {
  router.push('/')
}
</script>

<template>
  <div class="error-container">
    <div class="error-content">
      <div class="error-code">401</div>
      <div class="error-title">未授权</div>
      <div class="error-desc">抱歉，您没有权限访问此页面</div>
      <div class="error-actions">
        <el-button type="primary" @click="goHome">返回首页</el-button>
        <el-button @click="goBack">返回上一页</el-button>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.error-container {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100vh;
  background-color: #f2f3f5;
}

.error-content {
  text-align: center;

  .error-code {
    font-size: 120px;
    font-weight: bold;
    color: #f56c6c;
    line-height: 1;
    margin-bottom: 20px;
  }

  .error-title {
    font-size: 24px;
    color: #303133;
    margin-bottom: 12px;
  }

  .error-desc {
    font-size: 14px;
    color: #909399;
    margin-bottom: 30px;
  }

  .error-actions {
    display: flex;
    gap: 12px;
    justify-content: center;
  }
}
</style>
