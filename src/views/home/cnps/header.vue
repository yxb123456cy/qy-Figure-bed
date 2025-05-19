<template>
    <header class="header">
      <div class="header__logo">
        <div class="header__logo-icon">
          <i class="fas fa-images"></i>
        </div>
        <span class="header__logo-text">轻叶图床</span>
      </div>
      <nav class="header__nav">
        <button class="!rounded-button header__button" @click="$router.push('/workbench/settings')">开始使用</button>
      </nav>
    </header>
</template>

<script setup>
</script>

<style scoped>
.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 32px;
  background-color: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(8px);
  z-index: 1000;
}
.header__logo {
  display: flex;
  align-items: center;
}
.header__logo-icon {
  width: 32px;
  height: 32px;
  background: linear-gradient(to right, #3b82f6, #8b5cf6);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  margin-right: 8px;
}
.header__logo-text {
  font-size: 20px;
  font-weight: bold;
  color: #1f2937;
}
.header__nav {
  display: flex;
  align-items: center;
  gap: 32px;
}
.header__nav-link {
  color: #374151;
  text-decoration: none;
  transition: color 0.3s ease;
  font-size: 16px;
}
.header__nav-link:hover {
  color: #7c3aed;
}
.header__button {
  background: linear-gradient(90deg, #6366f1, #8b5cf6, #ec4899, #f59e0b);
  color: white;
  padding: 12px 24px;
  border: none;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 9999px;
  background-size: 400% 400%;
  animation: gradientAnimation 5s ease infinite;
}
.header__button:hover {
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
  transform: translateY(-2px);
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