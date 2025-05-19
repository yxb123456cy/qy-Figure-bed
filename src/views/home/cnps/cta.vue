<template>
    <div class="cta">
        <div class="cta__container">
            <h2 class="cta__title">开始使用轻叶图床，让图片管理更简单</h2>
            <p class="cta__description">
                无论是团队协作还是个人存储，我们都能满足您的需求
            </p>
            <button class="cta__button" @click="$router.push('/workbench/settings')">
                立即开始
            </button>
        </div>
    </div>
</template>
  
<script setup>
</script>

<style scoped>
.cta {
  padding: 128px 32px;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  text-align: center;
}
.cta__container {
  max-width: 1152px;
  margin: 0 auto;
}
.cta__title {
  font-size: 48px;
  font-weight: 800;
  color: white;
  margin-bottom: 32px;
  line-height: 1.2;
}
.cta__description {
  font-size: 24px;
  color: white;
  opacity: 0.95;
  margin-bottom: 48px;
  line-height: 1.6;
}
.cta__button {
  background: linear-gradient(90deg, #6366f1, #8b5cf6, #ec4899, #f59e0b);
  background-size: 400% 400%;
  color: white;
  padding: 20px 48px;
  font-size: 20px;
  font-weight: 700;
  border-radius: 9999px;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px 1px rgba(0, 0, 0, 0.1);
  animation: gradientAnimation 5s ease infinite;
}
.cta__button:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}
@keyframes gradientAnimation {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}
</style>