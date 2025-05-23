# 在线代码编辑器

一个支持多种编程语言的在线代码编辑器，类似于 LeetCode 的编程环境。使用 React + TypeScript + Vite 构建前端，Node.js + Express 构建后端。

## 功能特点

- 支持多种编程语言：
  - Python
  - JavaScript
  - Java
  - C++
- 实时代码编辑
- 代码执行
- 输入/输出支持
- 响应式设计
- 语法高亮
- 主题切换（亮色/暗色）
- 全屏模式
- 代码编译
- 复制到剪贴板
- 环境配置

## 技术栈

### 前端
- React 18
- TypeScript
- Vite
- Monaco Editor (VS Code 的编辑器)
- Tailwind CSS
- DaisyUI
- Axios
- Heroicons

### 后端
- Node.js
- Express
- TypeScript
- UUID

## 项目结构

```
online-code-editor/
├── frontend/           # 前端项目
│   ├── src/           # 源代码
│   │   ├── components/  # React 组件
│   │   └── config/     # 配置文件
│   ├── public/        # 静态资源
│   └── ...           # 配置文件
└── backend/           # 后端项目
    ├── src/          # 源代码
    └── ...          # 配置文件
```

## 快速开始

### 前端

```bash
cd frontend
npm install
npm run dev
```

前端将在 http://localhost:3000 运行

### 后端

```bash
cd backend
npm install
npm run dev
```

后端将在 http://localhost:3001 运行

## 环境配置

项目使用环境变量进行配置：

- `.env.development` - 开发环境设置
- `.env.production` - 生产环境设置

## 开发环境要求

- Node.js >= 18
- npm >= 9
- Python 3.x (用于运行 Python 代码)
- Java JDK (用于运行 Java 代码)
- G++ (用于运行 C++ 代码)

## 版本历史

### v2.0
- 添加代码编译功能
- 添加主题切换
- 添加全屏模式
- 添加复制到剪贴板功能
- 改进错误处理
- 添加环境配置

### v1.0
- 基础代码编辑器功能
- 多语言支持
- 输入/输出处理
- 语法高亮

## 作者

- chatwater
- Cursor

## 许可证

MIT 