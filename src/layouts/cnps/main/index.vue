<template>
    <main class="main-content">
      <div class="container">
        <router-view v-slot="{ Component }">
          <transition name="page" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </div>
    </main>
  </template>
  
  <script setup></script>
  
  <style scoped>
  .main-content {
    border-radius: 8px;
    padding: 24px;
    min-height: calc(100vh - 120px);
  }
  
  .container {
    max-width: 100%;
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
  
  @media (max-width: 768px) {
    .main-content {
      padding: 16px;
      min-height: calc(100vh - 80px);
    }
  }
  </style>