# Kairowan Admin

一个基于 Vue 3 + TypeScript + Vite + Element Plus 构建的现代化企业级后台管理系统。

## 项目简介

Kairowan Admin 是一个功能完善的后台管理系统前端项目，提供了用户管理、角色权限、系统监控、代码生成等企业级功能。采用最新的前端技术栈，具有良好的代码结构和开发体验。

## 技术栈

### 核心框架
- **Vue 3.5.24** - 渐进式 JavaScript 框架，使用 Composition API
- **TypeScript 5.9.3** - JavaScript 的超集，提供类型安全
- **Vite 7.2.4** - 下一代前端构建工具

### UI 框架
- **Element Plus 2.13.1** - 基于 Vue 3 的组件库
- **@element-plus/icons-vue 2.3.2** - Element Plus 图标库
- **Sass 1.97.3** - CSS 预处理器

### 状态管理
- **Pinia 3.0.4** - Vue 3 官方推荐的状态管理库
- **pinia-plugin-persistedstate 4.7.1** - Pinia 状态持久化插件

### 路由
- **Vue Router 4.6.4** - Vue 官方路由管理器，支持动态路由

### 数据可视化
- **ECharts 6.0.0** - 强大的图表库

### 工具库
- **Axios 1.13.4** - HTTP 客户端
- **dayjs 1.11.19** - 轻量级日期处理库
- **lodash-es 4.17.23** - JavaScript 实用工具库
- **js-cookie 3.0.5** - Cookie 操作库
- **nprogress 0.2.0** - 页面加载进度条

### 构建优化
- **unplugin-auto-import 21.0.0** - 自动导入 API
- **unplugin-vue-components 31.0.0** - 自动导入组件
- **terser 5.46.0** - 代码压缩工具

## 主要功能

### 系统管理
- **用户管理** - 用户的增删改查、密码重置、用户导出
- **角色管理** - 角色创建、权限分配、状态控制
- **菜单管理** - 动态菜单配置，树形结构管理
- **部门管理** - 组织架构管理，树形选择器
- **岗位管理** - 职位信息管理
- **字典管理** - 系统字典类型和数据管理，支持缓存刷新
- **参数配置** - 系统参数配置，支持缓存控制

### 系统监控
- **在线用户** - 实时在线用户监控，支持强制下线
- **定时任务** - Cron 任务管理（暂停、恢复、执行、删除）
- **操作日志** - 用户操作审计，支持导出
- **登录日志** - 登录历史记录，支持导出
- **服务监控** - 服务器性能和资源监控
- **缓存监控** - 缓存统计、大小跟踪、缓存清理

### 系统工具
- **代码生成** - 数据库表转代码生成工具
- **文件管理** - 文件上传、下载和管理
- **数据分析** - 数据可视化和分析

### 核心特性
- **仪表盘** - 统计卡片、访问趋势图表、数据分布图
- **个人中心** - 用户资料管理，头像上传
- **通知中心** - 系统通知管理
- **权限系统** - 基于角色的访问控制（RBAC），细粒度权限控制
- **动态路由** - 根据用户权限动态生成路由
- **响应式设计** - 支持移动端访问

## 项目结构

```
kairowan-admin/
├── src/
│   ├── api/                    # API 接口层
│   ├── assets/                 # 静态资源
│   ├── components/             # 公共组件
│   ├── composables/            # 组合式函数
│   ├── directives/             # 自定义指令
│   ├── layout/                 # 布局组件
│   ├── router/                 # 路由配置
│   ├── stores/                 # Pinia 状态管理
│   ├── styles/                 # 全局样式
│   ├── types/                  # TypeScript 类型定义
│   ├── utils/                  # 工具函数
│   ├── views/                  # 页面组件
│   ├── App.vue                 # 根组件
│   └── main.ts                 # 应用入口
├── public/                     # 公共静态文件
├── .env.development            # 开发环境配置
├── .env.production             # 生产环境配置
├── vite.config.ts              # Vite 配置
├── tsconfig.json               # TypeScript 配置
└── package.json                # 项目依赖
```

## 后端项目

本项目的后端使用 Ktor 3.0 框架开发：

**后端仓库地址**: [https://github.com/kairowan/kairowan-ktor.git](https://github.com/kairowan/kairowan-ktor.git)

### API 接口规范

后端 API 响应格式：
```typescript
{
  code: number,    // 状态码
  msg: string,     // 消息
  data: any        // 数据
}
```

### 主要接口
- **认证接口**: `/auth/login`, `/auth/logout`, `/auth/getInfo`, `/auth/getRouters`
- **系统管理**: `/system/user/*`, `/system/role/*`, `/system/menu/*` 等
- **系统监控**: `/monitor/online/*`, `/monitor/job/*`, `/monitor/operlog/*` 等
- **系统工具**: `/tool/gen/*`, `/tool/file/*`

## 快速开始

### 环境要求
- Node.js >= 18.0.0
- pnpm / npm / yarn

### 安装依赖
```bash
# 使用 npm
npm install

# 使用 pnpm
pnpm install

# 使用 yarn
yarn install
```

### 启动开发服务器
```bash
npm run dev
```

开发服务器将在 `http://localhost:3000` 启动，并自动打开浏览器。

### 构建生产版本
```bash
npm run build
```

构建产物将输出到 `dist` 目录。

### 预览生产构建
```bash
npm run preview
```

## 开发配置

### 环境变量

**开发环境** (`.env.development`):
```env
VITE_API_BASE_URL=http://localhost:8080
VITE_APP_TITLE=Kairowan Admin
VITE_APP_PORT=3000
```

**生产环境** (`.env.production`):
根据实际部署环境配置后端 API 地址。

### 代理配置

开发环境下，Vite 会将 `/api` 请求代理到 `http://localhost:8080`，确保后端服务已启动。

## 核心特性说明

### 权限控制

项目实现了完整的 RBAC 权限控制系统：

1. **路由权限**: 根据用户角色动态生成可访问的路由
2. **按钮权限**: 使用 `v-permission` 指令控制按钮显示
3. **角色权限**: 使用 `v-role` 指令基于角色控制元素显示

```vue
<!-- 权限指令示例 -->
<el-button v-permission="['system:user:add']">新增</el-button>
<el-button v-role="['admin']">管理员操作</el-button>
```

### 状态持久化

使用 `pinia-plugin-persistedstate` 插件实现状态持久化，用户登录状态、主题设置等会自动保存到本地存储。

### 自动导入

项目配置了自动导入功能：
- Vue API (ref, reactive, computed 等) 无需手动导入
- Element Plus 组件自动按需导入
- 减少样板代码，提升开发效率

### 构建优化

- **代码分割**: 将 Element Plus、ECharts 等大型库单独打包
- **代码压缩**: 使用 Terser 压缩代码，移除 console 和 debugger
- **Tree Shaking**: 自动移除未使用的代码

## 浏览器支持

- Chrome >= 87
- Firefox >= 78
- Safari >= 14
- Edge >= 88

## 开发规范

- 使用 TypeScript 编写代码，确保类型安全
- 遵循 Vue 3 Composition API 最佳实践
- 组件使用 `<script setup>` 语法
- 使用 ESLint 和 Prettier 保持代码风格一致

## 许可证

本项目仅供学习和参考使用。

## 联系方式

如有问题或建议，请提交 Issue 或 Pull Request。
