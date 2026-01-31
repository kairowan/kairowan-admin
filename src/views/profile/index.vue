<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { useAuthStore } from '@/stores/auth'
import { User, Lock, Clock, Setting } from '@element-plus/icons-vue'
import { uploadAvatar } from '@/api/tool'

const authStore = useAuthStore()
const activeTab = ref('profile')

// 用户信息表单
const profileForm = reactive({
  userName: authStore.userName || 'admin',
  nickName: authStore.nickName || '管理员',
  email: 'admin@kairowan.com',
  phone: '13800138000',
  gender: '1',
  remark: '系统管理员账号'
})

// 修改密码表单
const passwordForm = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const profileFormRef = ref()
const passwordFormRef = ref()

// 表单验证规则
const profileRules = {
  nickName: [
    { required: true, message: '请输入用户昵称', trigger: 'blur' }
  ],
  email: [
    { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
  ],
  phone: [
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码', trigger: 'blur' }
  ]
}

const passwordRules = {
  oldPassword: [
    { required: true, message: '请输入原密码', trigger: 'blur' }
  ],
  newPassword: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请确认新密码', trigger: 'blur' },
    {
      validator: (rule: any, value: any, callback: any) => {
        if (value !== passwordForm.newPassword) {
          callback(new Error('两次输入密码不一致'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ]
}

// 保存用户信息
const saveProfile = async () => {
  if (!profileFormRef.value) return

  await profileFormRef.value.validate()

  try {
    // TODO: 调用更新用户信息接口
    ElMessage.success('保存成功')
  } catch (error) {
    ElMessage.error('保存失败')
  }
}

// 修改密码
const changePassword = async () => {
  if (!passwordFormRef.value) return

  await passwordFormRef.value.validate()

  try {
    // TODO: 调用修改密码接口
    ElMessage.success('密码修改成功')
    passwordForm.oldPassword = ''
    passwordForm.newPassword = ''
    passwordForm.confirmPassword = ''
  } catch (error) {
    ElMessage.error('密码修改失败')
  }
}

// 操作日志数据
const operationLogs = ref([
  {
    id: 1,
    action: '登录系统',
    ip: '192.168.1.100',
    location: '广东深圳',
    time: '2026-01-29 10:30:00',
    status: 'success'
  },
  {
    id: 2,
    action: '修改用户信息',
    ip: '192.168.1.100',
    location: '广东深圳',
    time: '2026-01-29 09:15:00',
    status: 'success'
  },
  {
    id: 3,
    action: '修改密码',
    ip: '192.168.1.100',
    location: '广东深圳',
    time: '2026-01-28 16:20:00',
    status: 'success'
  },
  {
    id: 4,
    action: '登录失败',
    ip: '192.168.1.101',
    location: '广东深圳',
    time: '2026-01-28 14:10:00',
    status: 'error'
  }
])

// 头像上传
const uploadAvatarRef = ref()
const uploadingAvatar = ref(false)

const handleAvatarUpload = () => {
  uploadAvatarRef.value?.click()
}

const beforeAvatarUpload = (file: any) => {
  const isImage = file.type.startsWith('image/')
  const isLt2M = file.size / 1024 / 1024 < 2

  if (!isImage) {
    ElMessage.error('只能上传图片文件!')
    return false
  }
  if (!isLt2M) {
    ElMessage.error('图片大小不能超过 2MB!')
    return false
  }
  return true
}

const handleAvatarChange = async (event: any) => {
  const file = event.target.files[0]
  if (!file) return

  if (!beforeAvatarUpload(file)) return

  uploadingAvatar.value = true
  try {
    const formData = new FormData()
    formData.append('avatar', file)
    const res = await uploadAvatar(formData)

    // 更新头像URL
    if (res && res.url) {
      authStore.avatar = res.url
      ElMessage.success('头像上传成功')
    } else {
      // 如果没有返回URL，使用本地预览
      const reader = new FileReader()
      reader.onload = (e) => {
        authStore.avatar = e.target?.result as string
      }
      reader.readAsDataURL(file)
      ElMessage.success('头像上传成功')
    }
  } catch (error) {
    ElMessage.error('头像上传失败')
  } finally {
    uploadingAvatar.value = false
  }
}

</script>

<template>
  <div class="profile-container">
    <el-row :gutter="20">
      <!-- 左侧用户信息卡片 -->
      <el-col :xs="24" :lg="8">
        <el-card class="user-card">
          <div class="user-info">
            <el-avatar :size="100" :src="authStore.avatar" class="user-avatar">
              {{ authStore.nickName?.charAt(0) }}
            </el-avatar>
            <h3 class="user-name">{{ authStore.nickName || authStore.userName }}</h3>
            <p class="user-role">系统管理员</p>
            <input
              ref="uploadAvatarRef"
              type="file"
              accept="image/*"
              style="display: none"
              @change="handleAvatarChange"
            />
            <el-button
              type="primary"
              size="small"
              class="upload-btn"
              :loading="uploadingAvatar"
              @click="handleAvatarUpload"
            >
              {{ uploadingAvatar ? '上传中...' : '更换头像' }}
            </el-button>
          </div>

          <el-divider />

          <div class="user-stats">
            <div class="stat-item">
              <div class="stat-value">128</div>
              <div class="stat-label">登录次数</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">256</div>
              <div class="stat-label">操作记录</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">5</div>
              <div class="stat-label">待办事项</div>
            </div>
          </div>
        </el-card>
      </el-col>

      <!-- 右侧内容区域 -->
      <el-col :xs="24" :lg="16">
        <el-card class="content-card">
          <el-tabs v-model="activeTab" class="profile-tabs">
            <!-- 基本信息 -->
            <el-tab-pane label="基本信息" name="profile">
              <template #label>
                <span class="tab-label">
                  <el-icon><User /></el-icon>
                  基本信息
                </span>
              </template>

              <el-form
                ref="profileFormRef"
                :model="profileForm"
                :rules="profileRules"
                label-width="100px"
                class="profile-form"
              >
                <el-form-item label="用户名">
                  <el-input v-model="profileForm.userName" disabled />
                </el-form-item>

                <el-form-item label="用户昵称" prop="nickName">
                  <el-input v-model="profileForm.nickName" placeholder="请输入用户昵称" />
                </el-form-item>

                <el-form-item label="邮箱" prop="email">
                  <el-input v-model="profileForm.email" placeholder="请输入邮箱" />
                </el-form-item>

                <el-form-item label="手机号码" prop="phone">
                  <el-input v-model="profileForm.phone" placeholder="请输入手机号码" />
                </el-form-item>

                <el-form-item label="性别">
                  <el-radio-group v-model="profileForm.gender">
                    <el-radio label="1">男</el-radio>
                    <el-radio label="2">女</el-radio>
                  </el-radio-group>
                </el-form-item>

                <el-form-item label="备注">
                  <el-input
                    v-model="profileForm.remark"
                    type="textarea"
                    :rows="4"
                    placeholder="请输入备注"
                  />
                </el-form-item>

                <el-form-item>
                  <el-button type="primary" @click="saveProfile">保存修改</el-button>
                  <el-button>重置</el-button>
                </el-form-item>
              </el-form>
            </el-tab-pane>

            <!-- 修改密码 -->
            <el-tab-pane label="修改密码" name="password">
              <template #label>
                <span class="tab-label">
                  <el-icon><Lock /></el-icon>
                  修改密码
                </span>
              </template>

              <el-form
                ref="passwordFormRef"
                :model="passwordForm"
                :rules="passwordRules"
                label-width="100px"
                class="profile-form"
              >
                <el-form-item label="原密码" prop="oldPassword">
                  <el-input
                    v-model="passwordForm.oldPassword"
                    type="password"
                    placeholder="请输入原密码"
                    show-password
                  />
                </el-form-item>

                <el-form-item label="新密码" prop="newPassword">
                  <el-input
                    v-model="passwordForm.newPassword"
                    type="password"
                    placeholder="请输入新密码"
                    show-password
                  />
                </el-form-item>

                <el-form-item label="确认密码" prop="confirmPassword">
                  <el-input
                    v-model="passwordForm.confirmPassword"
                    type="password"
                    placeholder="请确认新密码"
                    show-password
                  />
                </el-form-item>

                <el-form-item>
                  <el-button type="primary" @click="changePassword">确认修改</el-button>
                  <el-button>重置</el-button>
                </el-form-item>
              </el-form>
            </el-tab-pane>

            <!-- 操作日志 -->
            <el-tab-pane label="操作日志" name="logs">
              <template #label>
                <span class="tab-label">
                  <el-icon><Clock /></el-icon>
                  操作日志
                </span>
              </template>

              <el-table :data="operationLogs" stripe class="logs-table">
                <el-table-column label="操作" prop="action" />
                <el-table-column label="IP地址" prop="ip" width="140" />
                <el-table-column label="地点" prop="location" width="120" />
                <el-table-column label="时间" prop="time" width="160" />
                <el-table-column label="状态" width="100">
                  <template #default="{ row }">
                    <el-tag :type="row.status === 'success' ? 'success' : 'danger'" size="small">
                      {{ row.status === 'success' ? '成功' : '失败' }}
                    </el-tag>
                  </template>
                </el-table-column>
              </el-table>
            </el-tab-pane>

            <!-- 账号安全 -->
            <el-tab-pane label="账号安全" name="security">
              <template #label>
                <span class="tab-label">
                  <el-icon><Setting /></el-icon>
                  账号安全
                </span>
              </template>

              <div class="security-list">
                <div class="security-item">
                  <div class="security-info">
                    <div class="security-title">账号密码</div>
                    <div class="security-desc">当前密码强度：强</div>
                  </div>
                  <el-button type="primary" link>修改</el-button>
                </div>

                <div class="security-item">
                  <div class="security-info">
                    <div class="security-title">密保手机</div>
                    <div class="security-desc">已绑定手机：138****8000</div>
                  </div>
                  <el-button type="primary" link>修改</el-button>
                </div>

                <div class="security-item">
                  <div class="security-info">
                    <div class="security-title">密保邮箱</div>
                    <div class="security-desc">已绑定邮箱：ad***@kairowan.com</div>
                  </div>
                  <el-button type="primary" link>修改</el-button>
                </div>

                <div class="security-item">
                  <div class="security-info">
                    <div class="security-title">二步验证</div>
                    <div class="security-desc">未开启</div>
                  </div>
                  <el-button type="primary" link>开启</el-button>
                </div>
              </div>
            </el-tab-pane>
          </el-tabs>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<style scoped lang="scss">
.profile-container {
  padding: 20px;

  .user-card {
    border-radius: 16px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);

    .user-info {
      text-align: center;
      padding: 20px 0;

      .user-avatar {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        font-size: 40px;
        font-weight: 600;
        margin-bottom: 16px;
        border: 4px solid #fff;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      }

      .user-name {
        font-size: 24px;
        font-weight: 600;
        color: #303133;
        margin: 0 0 8px 0;
      }

      .user-role {
        font-size: 14px;
        color: #909399;
        margin: 0 0 16px 0;
      }

      .upload-btn {
        border-radius: 20px;
      }
    }

    .user-stats {
      display: flex;
      justify-content: space-around;
      padding: 20px 0;

      .stat-item {
        text-align: center;

        .stat-value {
          font-size: 24px;
          font-weight: 600;
          color: #409eff;
          margin-bottom: 8px;
        }

        .stat-label {
          font-size: 14px;
          color: #909399;
        }
      }
    }
  }

  .content-card {
    border-radius: 16px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);

    .profile-tabs {
      :deep(.el-tabs__header) {
        margin-bottom: 24px;
      }

      .tab-label {
        display: flex;
        align-items: center;
        gap: 6px;
      }

      .profile-form {
        max-width: 600px;
      }

      .logs-table {
        :deep(.el-table__header) {
          th {
            background: #f5f7fa;
          }
        }
      }

      .security-list {
        .security-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px;
          border-bottom: 1px solid #f0f2f5;
          transition: all 0.3s;

          &:last-child {
            border-bottom: none;
          }

          &:hover {
            background: #f5f7fa;
          }

          .security-info {
            .security-title {
              font-size: 16px;
              font-weight: 600;
              color: #303133;
              margin-bottom: 8px;
            }

            .security-desc {
              font-size: 14px;
              color: #909399;
            }
          }
        }
      }
    }
  }
}

@media (max-width: 992px) {
  .profile-container {
    .user-card {
      margin-bottom: 20px;
    }
  }
}
</style>
