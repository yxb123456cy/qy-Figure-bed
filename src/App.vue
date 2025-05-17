<template>
  <el-config-provider :locale="zhCn">
    <div class="app-wrapper">
      <div class="app-main">
        <!-- 顶部导航 -->
        <header class="main-header">
          <div class="container">
            <div class="header-content">
              <!-- Logo 区域 -->
              <router-link to="/" class="header-logo">
                <img src="/favicon.svg" alt="logo">
                <span>{{ appTitle }}</span>
              </router-link>

              <!-- 导航菜单容器 -->
              <div class="nav-container">
                <nav class="main-nav">
                  <router-link
                      v-for="item in navItems"
                      :key="item.path"
                      :to="item.path"
                      class="nav-item"
                  >
                    <el-icon><component :is="item.icon" /></el-icon>
                    <span v-if="!isMobile">{{ item.title }}</span>
                  </router-link>
                </nav>
              </div>

              <!-- GitHub 链接 -->
              <div class="github-link">
                <a
                    href="https://github.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="github-button"
                >
                  <span>Github</span>
                </a>
              </div>
            </div>
          </div>
        </header>

        <main class="main-content">
          <div class="container">
            <router-view v-slot="{ Component }">
              <transition name="page" mode="out-in">
                <component :is="Component" />
              </transition>
            </router-view>
          </div>
        </main>
      </div>
    </div>
  </el-config-provider>
</template>

<script setup>
import { computed } from 'vue'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import { useWindowSize } from '@vueuse/core'

const { width } = useWindowSize()
const isMobile = computed(() => width.value <= 768)

// 获取文档标题
const appTitle = computed(() => {
  const title = document.title
  return title.split('-')[0].trim()
})

// 导航配置
const navItems = [
  { path: '/', title: '上传', icon: 'Upload' },
  { path: '/gallery', title: '图库', icon: 'Picture' },
  { path: '/settings', title: '设置', icon: 'Setting' }
]
</script>

<style>
/* 基础样式重置 */
* {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: var(--el-font-family);
  -webkit-font-smoothing: antialiased;
}

/* 布局容器 */
.app-wrapper {
  min-height: 100vh;
  display: flex;
}

.app-main {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  background: var(--el-bg-color-page);
}

.container {
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
  padding: 0 20px;
}

/* 头部导航 */
.main-header {
  height: 60px;
  background: var(--el-bg-color);
  border-bottom: 1px solid var(--el-border-color-light);
}

.header-content {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
}

/* Logo样式 */
.header-logo {
  display: flex;
  align-items: center;
  gap: 12px;
  text-decoration: none;
  color: var(--el-text-color-primary);
  flex: 0 0 auto;
}

.header-logo img {
  width: 24px;
  height: 24px;
}

.header-logo span {
  font-size: 16px;
  font-weight: 500;
  color: var(--el-text-color-primary);
  white-space: nowrap;
}

/* 导航菜单 */
.nav-container {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  justify-content: center;
}

.main-nav {
  display: flex;
  align-items: center;
  gap: 20px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: 8px;
  text-decoration: none;
  color: var(--el-text-color-regular);
  transition: all 0.2s;
}

.nav-item:hover,
.nav-item.router-link-active {
  color: var(--el-color-primary);
  background: var(--el-color-primary-light-9);
}

.nav-item .el-icon {
  font-size: 20px;
}

.nav-item span {
  font-size: 14px;
}

/* GitHub按钮 */
.github-button {
  display: flex;
  align-items: center;
  padding: 8px 16px;
  border-radius: 8px;
  text-decoration: none;
  color: var(--el-text-color-regular);
  transition: all 0.2s;
  background: var(--el-bg-color-page);
}

.github-button:hover {
  color: var(--el-color-primary);
  background: var(--el-color-primary-light-9);
}

.github-button span {
  font-size: 14px;
}

/* 主要内容区 */
.main-content {
  flex: 1;
  padding: 20px 0;
  overflow: auto;
}

/* 页面过渡动画 */
.page-enter-active,
.page-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.page-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.page-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

.page-enter-to,
.page-leave-from {
  opacity: 1;
  transform: translateY(0);
}

/* 滚动条样式 */
::-webkit-scrollbar {
  width: 0;
}

/* 响应式适配 */
@media screen and (max-width: 768px) {
  .container {
    padding: 0 12px;
  }

  .header-content {
    gap: 12px;
  }

  .nav-item,
  .github-button {
    padding: 8px;
  }

  .nav-item .el-icon,
  .github-button .el-icon {
    font-size: 20px;
  }

  .header-logo span,
  .github-button span {
    font-size: 14px;
  }
}

@media screen and (max-width: 360px) {
  .container {
    padding: 0 8px;
  }

  .nav-item,
  .github-button {
    padding: 6px;
  }
}
</style>