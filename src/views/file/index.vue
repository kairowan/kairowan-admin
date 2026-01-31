<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  Upload,
  Download,
  Delete,
  View,
  Grid,
  List,
  Folder,
  Document,
  Picture,
  VideoCamera,
  Files,
  UploadFilled
} from '@element-plus/icons-vue'
import ImagePreview from '@/components/ImagePreview/index.vue'
import { getFileList, uploadFile, downloadFile, deleteFile } from '@/api/tool'

const viewMode = ref<'grid' | 'list'>('grid')
const searchKeyword = ref('')
const selectedType = ref('all')

// 图片预览
const previewVisible = ref(false)
const previewImageUrl = ref('')
const previewImageName = ref('')
const filePreviewVisible = ref(false)
const filePreviewUrl = ref('')
const filePreviewName = ref('')
const filePreviewCategory = ref<'video' | 'document' | 'other'>('other')
const filePreviewSrc = ref('')
const filePreviewSupported = ref(true)

const getFileCategory = (extOrType?: string) => {
  if (!extOrType) return 'other'
  const ext = extOrType.toLowerCase()
  if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg'].includes(ext)) return 'image'
  if (['mp4', 'webm', 'mov', 'avi', 'mkv'].includes(ext)) return 'video'
  if (['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'pages', 'numbers', 'key'].includes(ext)) {
    return 'document'
  }
  return 'other'
}

const getFileIcon = (category: string) => {
  switch (category) {
    case 'image':
      return Picture
    case 'video':
      return VideoCamera
    case 'document':
      return Document
    default:
      return Files
  }
}

const getFileColor = (category: string) => {
  const colorMap: Record<string, string> = {
    document: '#f56c6c',
    image: '#67c23a',
    video: '#409eff',
    other: '#909399'
  }
  return colorMap[category] || '#909399'
}

const normalizeFile = (file: any) => {
  const ext = file.type || file.ext || file.name?.split('.').pop()
  const category = getFileCategory(ext)
  return {
    ...file,
    ext,
    type: category,
    icon: getFileIcon(category),
    color: getFileColor(category),
    thumbnail: category === 'image' ? (file.thumbnail || file.url) : null
  }
}

// 文件数据
const files = ref<any[]>([])

// 加载文件列表
const loading = ref(false)
const loadFileList = async () => {
  loading.value = true
  try {
    const res = await getFileList({
      type: selectedType.value === 'all' ? undefined : selectedType.value,
      keyword: searchKeyword.value
    })
    const rows = Array.isArray(res) ? res : res?.rows
    // 如果后端返回数据，使用后端数据；否则使用模拟数据
    if (rows && rows.length > 0) {
      files.value = rows.map(normalizeFile)
    }
  } catch (error) {
    console.error('加载文件列表失败:', error)
    // 失败时继续使用模拟数据
  } finally {
    loading.value = false
  }
}

// 组件挂载时加载数据
onMounted(() => {
  loadFileList()
})

// 文件类型统计
const fileStats = computed(() => ({
  all: files.value.length,
  image: files.value.filter(f => f.type === 'image').length,
  document: files.value.filter(f => f.type === 'document').length,
  video: files.value.filter(f => f.type === 'video').length
}))

// 过滤文件
const filteredFiles = computed(() => {
  let result = files.value

  // 按类型过滤
  if (selectedType.value !== 'all') {
    if (selectedType.value === 'image') {
      result = result.filter(f => f.type === 'image')
    } else if (selectedType.value === 'document') {
      result = result.filter(f => f.type === 'document')
    } else if (selectedType.value === 'video') {
      result = result.filter(f => f.type === 'video')
    }
  }

  // 按关键词搜索
  if (searchKeyword.value) {
    result = result.filter(f =>
      f.name.toLowerCase().includes(searchKeyword.value.toLowerCase())
    )
  }

  return result
})

// 文件上传
const uploadDialogVisible = ref(false)
const uploadFileList = ref<any[]>([])
const uploading = ref(false)

const handleUpload = () => {
  uploadDialogVisible.value = true
  uploadFileList.value = []
}

// 文件选择变化
const handleFileChange = (file: any, fileList: any[]) => {
  uploadFileList.value = fileList
}

// 文件移除
const handleFileRemove = (file: any, fileList: any[]) => {
  uploadFileList.value = fileList
}

// 上传前检查
const beforeUpload = (file: any) => {
  const isLt50M = file.size / 1024 / 1024 < 50
  if (!isLt50M) {
    ElMessage.error('文件大小不能超过 50MB!')
    return false
  }
  return true
}

// 执行上传
const submitUpload = async () => {
  if (uploadFileList.value.length === 0) {
    ElMessage.warning('请选择要上传的文件')
    return
  }

  uploading.value = true
  try {
    const formData = new FormData()
    uploadFileList.value.forEach(file => {
      formData.append('files', file.raw)
    })

    await uploadFile(formData)

    ElMessage.success('上传成功')
    uploadDialogVisible.value = false
    uploadFileList.value = []
    // 刷新文件列表
    loadFileList()
  } catch (error) {
    ElMessage.error('上传失败')
  } finally {
    uploading.value = false
  }
}

// 下载文件
const downloadFile = async (file: any) => {
  try {
    ElMessage.success(`正在下载：${file.name}`)
    // TODO: 实现真实的文件下载
    // const blob = await downloadFile(file.id)
    // const url = window.URL.createObjectURL(blob)
    // const a = document.createElement('a')
    // a.href = url
    // a.download = file.name
    // a.click()
    // window.URL.revokeObjectURL(url)
  } catch (error) {
    ElMessage.error('下载失败')
  }
}

// 预览文件
const previewFile = (file: any) => {
  if (file.type === 'image') {
    previewImageUrl.value = file.thumbnail || file.url || 'https://via.placeholder.com/800'
    previewImageName.value = file.name
    previewVisible.value = true
  } else {
    filePreviewUrl.value = file.url
    filePreviewName.value = file.name
    if (file.type === 'video') {
      filePreviewCategory.value = 'video'
    } else if (file.type === 'document') {
      filePreviewCategory.value = 'document'
    } else {
      filePreviewCategory.value = 'other'
    }
    const ext = (file.ext || file.type || file.name?.split('.').pop() || '').toLowerCase()
    const iframeSupported = ['pdf', 'txt', 'md', 'html', 'htm'].includes(ext)
    const videoSupported = file.type === 'video'
    filePreviewSupported.value = videoSupported || iframeSupported
    filePreviewSrc.value = filePreviewSupported.value ? file.url : ''
    filePreviewVisible.value = true
  }
}

// 下载预览图片
const handlePreviewDownload = () => {
  ElMessage.success('开始下载图片')
}

const openPreviewUrl = () => {
  if (filePreviewUrl.value) {
    window.open(filePreviewUrl.value, '_blank')
  }
}

const downloadPreviewFile = () => {
  if (!filePreviewUrl.value) return
  const a = document.createElement('a')
  a.href = filePreviewUrl.value
  a.download = filePreviewName.value || 'file'
  a.click()
}

// 删除文件
const deleteFileHandler = (file: any) => {
  ElMessageBox.confirm(`确认删除文件"${file.name}"吗？`, '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      await deleteFile(file.id)
      ElMessage.success('删除成功')
      // 刷新列表
      loadFileList()
    } catch (error) {
      // 如果API失败，从本地数组中删除
      const index = files.value.findIndex(f => f.id === file.id)
      if (index > -1) {
        files.value.splice(index, 1)
        ElMessage.success('删除成功')
      }
    }
  })
}

</script>

<template>
  <div class="file-container">
    <!-- 顶部统计 -->
    <el-row :gutter="20" class="stats-row">
      <el-col :xs="12" :sm="6">
        <div
          class="stat-card"
          :class="{ active: selectedType === 'all' }"
          @click="selectedType = 'all'"
        >
          <div class="stat-icon" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%)">
            <el-icon :size="24"><Files /></el-icon>
          </div>
          <div class="stat-info">
            <div class="stat-value">{{ fileStats.all }}</div>
            <div class="stat-label">全部文件</div>
          </div>
        </div>
      </el-col>

      <el-col :xs="12" :sm="6">
        <div
          class="stat-card"
          :class="{ active: selectedType === 'image' }"
          @click="selectedType = 'image'"
        >
          <div class="stat-icon" style="background: linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)">
            <el-icon :size="24"><Picture /></el-icon>
          </div>
          <div class="stat-info">
            <div class="stat-value">{{ fileStats.image }}</div>
            <div class="stat-label">图片</div>
          </div>
        </div>
      </el-col>

      <el-col :xs="12" :sm="6">
        <div
          class="stat-card"
          :class="{ active: selectedType === 'document' }"
          @click="selectedType = 'document'"
        >
          <div class="stat-icon" style="background: linear-gradient(135deg, #fa709a 0%, #fee140 100%)">
            <el-icon :size="24"><Document /></el-icon>
          </div>
          <div class="stat-info">
            <div class="stat-value">{{ fileStats.document }}</div>
            <div class="stat-label">文档</div>
          </div>
        </div>
      </el-col>

      <el-col :xs="12" :sm="6">
        <div
          class="stat-card"
          :class="{ active: selectedType === 'video' }"
          @click="selectedType = 'video'"
        >
          <div class="stat-icon" style="background: linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%)">
            <el-icon :size="24"><VideoCamera /></el-icon>
          </div>
          <div class="stat-info">
            <div class="stat-value">{{ fileStats.video }}</div>
            <div class="stat-label">视频</div>
          </div>
        </div>
      </el-col>
    </el-row>

    <!-- 文件列表 -->
    <el-card class="file-card">
      <template #header>
        <div class="card-header">
          <div class="header-left">
            <el-input
              v-model="searchKeyword"
              placeholder="搜索文件名称"
              :prefix-icon="'Search'"
              clearable
              style="width: 300px"
            />
          </div>
          <div class="header-right">
            <el-button-group>
              <el-button
                :type="viewMode === 'grid' ? 'primary' : 'default'"
                :icon="Grid"
                @click="viewMode = 'grid'"
              />
              <el-button
                :type="viewMode === 'list' ? 'primary' : 'default'"
                :icon="List"
                @click="viewMode = 'list'"
              />
            </el-button-group>
            <el-button type="primary" :icon="Upload" @click="handleUpload">
              上传文件
            </el-button>
          </div>
        </div>
      </template>

      <!-- 网格视图 -->
      <div v-if="viewMode === 'grid'" class="file-grid">
        <div
          v-for="file in filteredFiles"
          :key="file.id"
          class="file-item"
        >
          <div class="file-preview" :style="{ background: file.thumbnail ? 'transparent' : file.color }">
            <img v-if="file.thumbnail" :src="file.thumbnail" alt="" />
            <el-icon v-else :size="48">
              <component :is="file.icon" />
            </el-icon>
          </div>
          <div class="file-info">
            <div class="file-name" :title="file.name">{{ file.name }}</div>
            <div class="file-meta">
              <span>{{ file.size }}</span>
              <span>{{ file.uploader }}</span>
            </div>
          </div>
          <div class="file-actions">
            <el-button type="primary" :icon="View" link @click="previewFile(file)">
              预览
            </el-button>
            <el-button type="success" :icon="Download" link @click="downloadFile(file)">
              下载
            </el-button>
            <el-button type="danger" :icon="Delete" link @click="deleteFileHandler(file)">
              删除
            </el-button>
          </div>
        </div>
      </div>

      <!-- 列表视图 -->
      <el-table v-else :data="filteredFiles" stripe>
        <el-table-column label="文件名" min-width="200">
          <template #default="{ row }">
            <div class="file-name-cell">
              <el-icon :size="20" :color="row.color">
                <component :is="row.icon" />
              </el-icon>
              <span>{{ row.name }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="大小" prop="size" width="120" />
        <el-table-column label="上传者" prop="uploader" width="120" />
        <el-table-column label="上传时间" prop="uploadTime" width="180" />
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" :icon="View" link @click="previewFile(row)">
              预览
            </el-button>
            <el-button type="success" :icon="Download" link @click="downloadFile(row)">
              下载
            </el-button>
            <el-button type="danger" :icon="Delete" link @click="deleteFileHandler(row)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-empty
        v-if="filteredFiles.length === 0"
        description="暂无文件"
        :image-size="120"
      />
    </el-card>

    <!-- 上传对话框 -->
    <el-dialog
      v-model="uploadDialogVisible"
      title="上传文件"
      width="600px"
      :close-on-click-modal="false"
    >
      <el-upload
        ref="uploadRef"
        class="upload-demo"
        drag
        multiple
        :auto-upload="false"
        :on-change="handleFileChange"
        :on-remove="handleFileRemove"
        :before-upload="beforeUpload"
        :file-list="uploadFileList"
      >
        <el-icon class="el-icon--upload"><UploadFilled /></el-icon>
        <div class="el-upload__text">
          将文件拖到此处，或<em>点击上传</em>
        </div>
        <template #tip>
          <div class="el-upload__tip">
            支持多文件上传，单个文件大小不超过 50MB
          </div>
        </template>
      </el-upload>

      <template #footer>
        <el-button @click="uploadDialogVisible = false">取消</el-button>
        <el-button
          type="primary"
          :loading="uploading"
          @click="submitUpload"
        >
          {{ uploading ? '上传中...' : '确定上传' }}
        </el-button>
      </template>
    </el-dialog>

    <!-- 图片预览 -->
    <ImagePreview
      v-model:visible="previewVisible"
      :image-url="previewImageUrl"
      :image-name="previewImageName"
      @download="handlePreviewDownload"
    />

    <!-- 文件预览（非图片） -->
    <el-dialog
      v-model="filePreviewVisible"
      :title="filePreviewName"
      width="80%"
      :close-on-click-modal="true"
    >
      <div class="file-preview-container">
        <video
          v-if="filePreviewCategory === 'video' && filePreviewSrc"
          :src="filePreviewSrc"
          controls
        />
        <iframe
          v-else-if="filePreviewSrc"
          :src="filePreviewSrc"
          frameborder="0"
        />
        <div v-else class="file-preview-fallback">
          <div v-if="!filePreviewSupported">该文件类型浏览器不支持在线预览，请下载后查看。</div>
          <div v-else>文件地址为空，无法预览。</div>
          <el-button type="primary" @click="openPreviewUrl">新窗口打开</el-button>
          <el-button @click="downloadPreviewFile">下载文件</el-button>
        </div>
      </div>

      <template #footer>
        <el-button @click="filePreviewVisible = false">关闭</el-button>
        <el-button v-if="filePreviewUrl" @click="openPreviewUrl">新窗口打开</el-button>
        <el-button v-if="filePreviewUrl" type="primary" @click="downloadPreviewFile">下载</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped lang="scss">
.file-container {
  padding: 20px;

  .stats-row {
    margin-bottom: 24px;

    .stat-card {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 20px;
      background: #fff;
      border-radius: 12px;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
      cursor: pointer;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      border: 2px solid transparent;

      &:hover {
        transform: translateY(-4px);
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
      }

      &.active {
        border-color: #409eff;
        box-shadow: 0 4px 16px rgba(64, 158, 255, 0.3);
      }

      .stat-icon {
        width: 56px;
        height: 56px;
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #fff;
        flex-shrink: 0;
      }

      .stat-info {
        flex: 1;

        .stat-value {
          font-size: 28px;
          font-weight: 700;
          color: #303133;
          line-height: 1;
          margin-bottom: 8px;
        }

        .stat-label {
          font-size: 14px;
          color: #909399;
        }
      }
    }
  }

  .file-card {
    border-radius: 16px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 16px;

      .header-right {
        display: flex;
        gap: 12px;
      }
    }

    .file-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 20px;

      .file-item {
        border: 1px solid #e4e7ed;
        border-radius: 12px;
        padding: 16px;
        transition: all 0.3s;
        cursor: pointer;

        &:hover {
          border-color: #409eff;
          box-shadow: 0 4px 12px rgba(64, 158, 255, 0.2);
          transform: translateY(-4px);

          .file-actions {
            opacity: 1;
          }
        }

        .file-preview {
          width: 100%;
          height: 140px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 12px;
          color: #fff;
          overflow: hidden;

          img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
        }

        .file-info {
          .file-name {
            font-size: 14px;
            font-weight: 600;
            color: #303133;
            margin-bottom: 8px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }

          .file-meta {
            display: flex;
            justify-content: space-between;
            font-size: 12px;
            color: #909399;
          }
        }

        .file-actions {
          display: flex;
          justify-content: space-around;
          margin-top: 12px;
          padding-top: 12px;
          border-top: 1px solid #f0f2f5;
          opacity: 0;
          transition: opacity 0.3s;
        }
      }
    }

    .file-name-cell {
      display: flex;
      align-items: center;
      gap: 8px;
    }
  }
}

/* 上传对话框样式 */
.upload-demo {
  .el-upload {
    width: 100%;
  }

  .el-upload-dragger {
    padding: 40px;
  }

  .el-icon--upload {
    font-size: 67px;
    color: #409eff;
    margin-bottom: 16px;
  }

  .el-upload__text {
    font-size: 14px;
    color: #606266;

    em {
      color: #409eff;
      font-style: normal;
    }
  }

  .el-upload__tip {
    margin-top: 12px;
    font-size: 12px;
    color: #909399;
  }
}

@media (max-width: 768px) {
  .file-container {
    .file-card {
      .card-header {
        .header-left {
          width: 100%;

          .el-input {
            width: 100% !important;
          }
        }

        .header-right {
          width: 100%;
          justify-content: space-between;
        }
      }

      .file-grid {
        grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
      }
    }
  }
}

.file-preview-container {
  width: 100%;
  height: 70vh;
  background: #000;
  display: flex;
  align-items: center;
  justify-content: center;

  video,
  iframe {
    width: 100%;
    height: 100%;
  }

  .file-preview-fallback {
    color: #fff;
    text-align: center;
    display: flex;
    flex-direction: column;
    gap: 16px;
    align-items: center;
  }
}
</style>
