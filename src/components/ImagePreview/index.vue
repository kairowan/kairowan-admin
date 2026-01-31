<script setup lang="ts">
import { ref, computed } from 'vue'
import { Close, ZoomIn, ZoomOut, RefreshLeft, RefreshRight, Download } from '@element-plus/icons-vue'

interface Props {
  visible: boolean
  imageUrl: string
  imageName?: string
}

const props = withDefaults(defineProps<Props>(), {
  imageName: '图片预览'
})

const emit = defineEmits(['update:visible', 'download'])

const dialogVisible = computed({
  get: () => props.visible,
  set: (val) => emit('update:visible', val)
})

const scale = ref(1)
const rotate = ref(0)

const handleZoomIn = () => {
  scale.value = Math.min(scale.value + 0.2, 3)
}

const handleZoomOut = () => {
  scale.value = Math.max(scale.value - 0.2, 0.2)
}

const handleRotateLeft = () => {
  rotate.value -= 90
}

const handleRotateRight = () => {
  rotate.value += 90
}

const handleDownload = () => {
  emit('download')
}

const handleClose = () => {
  scale.value = 1
  rotate.value = 0
  dialogVisible.value = false
}
</script>

<template>
  <el-dialog
    v-model="dialogVisible"
    :title="imageName"
    width="80%"
    :close-on-click-modal="true"
    @close="handleClose"
    class="image-preview-dialog"
  >
    <div class="image-preview-container">
      <div class="image-wrapper">
        <img
          :src="imageUrl"
          :style="{
            transform: `scale(${scale}) rotate(${rotate}deg)`,
            transition: 'transform 0.3s'
          }"
          alt="预览图片"
        />
      </div>

      <div class="toolbar">
        <el-button-group>
          <el-button :icon="ZoomIn" @click="handleZoomIn" title="放大" />
          <el-button :icon="ZoomOut" @click="handleZoomOut" title="缩小" />
          <el-button :icon="RefreshLeft" @click="handleRotateLeft" title="逆时针旋转" />
          <el-button :icon="RefreshRight" @click="handleRotateRight" title="顺时针旋转" />
          <el-button :icon="Download" @click="handleDownload" title="下载" />
        </el-button-group>
      </div>
    </div>
  </el-dialog>
</template>

<style scoped lang="scss">
.image-preview-dialog {
  :deep(.el-dialog__body) {
    padding: 0;
    background: #000;
  }

  .image-preview-container {
    position: relative;
    width: 100%;
    height: 70vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #000;

    .image-wrapper {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;

      img {
        max-width: 100%;
        max-height: 100%;
        object-fit: contain;
      }
    }

    .toolbar {
      position: absolute;
      bottom: 20px;
      left: 50%;
      transform: translateX(-50%);
      background: rgba(0, 0, 0, 0.7);
      padding: 10px;
      border-radius: 8px;

      .el-button-group {
        .el-button {
          background: transparent;
          border-color: rgba(255, 255, 255, 0.3);
          color: #fff;

          &:hover {
            background: rgba(255, 255, 255, 0.1);
            border-color: rgba(255, 255, 255, 0.5);
          }
        }
      }
    }
  }
}
</style>
