<template>
  <div class="layouts-wrapper">
    <div class="layouts-main">
      <!-- S 顶部导航 -->
      <Header />
      <!-- E 顶部导航 -->

      <!-- S 主内容区域 -->
      <div class="layouts-content">
        <Main />
      </div>
      <!-- E 主内容区域 -->
    </div>
  </div>
</template>

<script setup>
import Header from './cnps/header/index.vue'
import Main from './cnps/main/index.vue'
</script>

<style scoped>
.layouts-wrapper {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.layouts-main {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.layouts-content {
  flex: 1;
  padding: 24px;
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
}

@media (max-width: 768px) {
  .layouts-content {
    padding: 16px;
  }
}
</style>