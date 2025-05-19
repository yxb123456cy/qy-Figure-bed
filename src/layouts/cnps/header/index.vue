<template>
  <header class="main-header">
    <div class="header-content">
      <!-- Logo 区域 -->
      <router-link to="/" class="header-logo">
        <img src="/favicon.svg" alt="logo">
        <span v-if="!isMobile" class="logo-text">轻叶图床</span>
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
          href="https://github.com/yxb123456cy/qy-Figure-bed"
          target="_blank"
          rel="noopener noreferrer"
          class="github-button"
        >
          <svg class="github-icon" viewBox="0 0 16 16" width="24" height="24">
            <path fill="currentColor" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
          </svg>
          <span v-if="!isMobile">Github</span>
        </a>
      </div>
    </div>
  </header>
</template>

<script setup>
import { computed } from 'vue'
import { useWindowSize } from '@vueuse/core'

const { width } = useWindowSize()
const isMobile = computed(() => width.value <= 768)

// 导航配置
const navItems = [
  { path: '/workbench/upload', title: '上传', icon: 'Upload' },
  { path: '/workbench/gallery', title: '图库', icon: 'Picture' },
  { path: '/workbench/settings', title: '设置', icon: 'Setting' }
]
</script>

<style scoped>
.main-header {
  background: #ffffff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 0 24px;
  position: sticky;
  top: 0;
  z-index: 1000;
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 64px;
}

.header-logo {
  display: flex;
  align-items: center;
  text-decoration: none;
  color: #2c3e50;
  gap: 8px;
}

.header-logo img {
  height: 32px;
  width: 32px;
  flex-shrink: 0;
}

.logo-text {
  font-weight: 600;
  font-size: 1.2rem;
  white-space: nowrap;
}

.nav-container {
  flex: 1;
  margin: 0 24px;
}

.main-nav {
  display: flex;
  gap: 16px;
  justify-content: center;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  text-decoration: none;
  color: #2c3e50;
  border-radius: 6px;
  transition: all 0.2s ease;
}

.nav-item:hover {
  background-color: #f5f5f5;
  transform: translateY(-1px);
}

.github-button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: 6px;
  text-decoration: none;
  color: #2c3e50;
  transition: all 0.2s ease;
}

.github-button:hover {
  background-color: #f5f5f5;
  transform: translateY(-1px);
}

.github-icon {
  width: 24px;
  height: 24px;
}

@media (max-width: 768px) {
  .main-header {
    padding: 0 16px;
  }

  .header-content {
    height: 56px;
  }

  .header-logo img {
    margin-right: 0;
  }

  .logo-text {
    display: none;
  }

  .nav-container {
    margin: 0 12px;
  }

  .nav-item span {
    display: none;
  }

  .github-button {
    padding: 8px;
  }

  .github-button span {
    display: none;
  }
}
</style>
