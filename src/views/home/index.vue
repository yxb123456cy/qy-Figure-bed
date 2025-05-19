<template>
  <div class="home">
    <!-- S 导航栏 -->
    <Header />
    <!-- E 导航栏 -->

    <!-- S Hero 区域 -->
     <Hero />
    <!-- E Hero 区域 -->

    <!-- S 功能特点区域 -->
    <Features />
    <!-- E 功能特点区域 --> 

    <!-- S 应用场景区域 -->
    <Scenarios />
    <!-- E 应用场景区域 -->

    <!-- S 高级功能区域 -->
    <AdvancedFeatures />
    <!-- E 高级功能区域 -->

    <!-- S 相册功能展示 -->
    <Album />
    <!-- E 相册功能展示 -->

    <!-- S 社交互动功能 -->
    <Social />
    <!-- E 社交互动功能 -->

    <!-- S 行动召唤 -->
     <Cta />
    <!-- E 行动召唤 -->

    <!-- S 页脚 -->
    <Footer />
    <!-- E 页脚 -->
  </div>
</template>

<script lang="ts" setup>
import Header from './cnps/header.vue'
import Hero from './cnps/hero.vue'
import Features from './cnps/features.vue'
import Scenarios from "./cnps/scenarios.vue"
import AdvancedFeatures from "./cnps/advanced-features.vue"
import Album from "./cnps/album.vue"
import Social from "./cnps/social.vue"
import Cta from "./cnps/cta.vue"
import Footer from "./cnps/footer.vue"
</script>

<style scoped>
.home {
  min-height: 100vh;
  background: linear-gradient(135deg, #f0f7ff 0%, #f5f3ff 50%, #fdf2f8 100%);
}

/* 自定义滚动条 */
::-webkit-scrollbar {
  width: 8px;
}
::-webkit-scrollbar-track {
  background: #f1f1f1;
}
::-webkit-scrollbar-thumb {
  background: #c7d2fe;
  border-radius: 4px;
}
::-webkit-scrollbar-thumb:hover {
  background: #a5b4fc;
}
</style>
