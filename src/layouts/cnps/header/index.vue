<template>
  <header class="main-header">
    <div class="header-content">
      <!-- S Logo 区域 -->
      <router-link to="/" class="header-logo">
        <img src="/favicon.svg" alt="logo">
        <span v-if="!isMobile" class="logo-text">轻叶图床</span>
      </router-link>
      <!-- E Logo 区域 -->

      <!-- S 导航菜单容器 -->
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
      <!-- E 导航菜单容器 -->

      <div class="right-action">
        <!-- S 语言切换 -->
        <!-- <LocaleSwitch /> -->
        <!-- E 语言切换 -->

        <!-- S 主题切换 -->
        <ThemeToggle />
        <!-- E 主题切换 -->
        <!-- S GitHub 链接 -->
        <!-- E GitHub 链接 -->
         <!-- S 回到顶部 -->
        <BackTop />
        <!-- E 回到顶部 -->
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

 .nav-item.router-link-active {
   color: #409eff;
   background-color: #ecf5ff;
 }

 .nav-item.router-link-active:hover {
   background-color: #d9ecff;
 }

.nav-item:hover {
  background-color: #f5f5f5;
  transform: translateY(-1px);
}

.right-action {
  display: flex;
  align-items: center;
  gap: 12px;
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
