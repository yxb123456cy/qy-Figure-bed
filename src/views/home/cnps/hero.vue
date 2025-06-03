<template>
    <section class="hero">
      <div class="hero__content">
        <div class="hero__text">
          <h1 class="hero__title">在线图片共享平台</h1>
          <p class="hero__description">
            以最简单的方式管理图片，团队协作与个人存储的完美结合，随时随地访问您的图片资源
          </p>
          <button class="!rounded-button hero__button" @click="handleClick">快速体验</button>
        </div>
        <div class="hero__image-container">
          <img
            src="https://qy-red-book.oss-cn-guangzhou.aliyuncs.com/i/2025/05/19/itl113d3.jpg"
            alt="图片共享平台预览"
            class="hero__image"
          />
        </div>
      </div>
    </section>
</template>

<script setup>
import { useCurrentInstance } from '../../../hooks'

const { router } = useCurrentInstance()

const handleClick = () => {
  router.push('/workbench/settings')
}
</script>

<style scoped>
.hero {
  padding: 10rem 2rem 6rem;
  max-width: 1440px;
  margin: 0 auto;
}

.hero__content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 6rem;
  max-width: 1200px;
  margin: 0 auto;
}

.hero__text {
  flex: 1;
  animation: fadeInLeft 1s ease-out;
}

.hero__title {
  font-size: 4rem;
  font-weight: 800;
  color: #1f2937;
  margin-bottom: 2rem;
  line-height: 1.1;
  letter-spacing: -0.05em;
}

.hero__description {
  font-size: 1.375rem;
  color: #4b5563;
  margin-bottom: 3rem;
  line-height: 1.7;
  max-width: 600px;
}

.hero__button {
  background: linear-gradient(135deg, #3b82f6, #4f46e5);
  color: white;
  padding: 1.25rem 2.5rem;
  font-size: 1.25rem;
  font-weight: 600;
  border: none;
  cursor: pointer;
  border-radius: 0.75rem;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px -1px rgba(59, 130, 246, 0.3);
}

.hero__button:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 12px -1px rgba(59, 130, 246, 0.4);
}

.hero__image-container {
  flex: 1;
  position: relative;
  animation: fadeInRight 1s ease-out;
}

.hero__image {
  width: 100%;
  height: auto;
  object-fit: cover;
  border-radius: 1.25rem;
  box-shadow:
    0 25px 50px -12px rgba(0, 0, 0, 0.15),
    0 12px 24px -8px rgba(0, 0, 0, 0.1);
  transform: rotate(3deg);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.hero__image:hover {
  transform: rotate(0deg);
  box-shadow:
    0 32px 64px -12px rgba(0, 0, 0, 0.2),
    0 16px 32px -8px rgba(0, 0, 0, 0.15);
}

@keyframes fadeInLeft {
  0% {
    opacity: 0;
    transform: translateX(-50px);
  }
  100% {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes fadeInRight {
  0% {
    opacity: 0;
    transform: translateX(50px);
  }
  100% {
    opacity: 1;
    transform: translateX(0);
  }
}

@media (max-width: 1024px) {
  .hero {
    padding: 8rem 2rem 4rem;
  }
  
  .hero__content {
    flex-direction: column;
    gap: 4rem;
    text-align: center;
  }
  
  .hero__title {
    font-size: 3rem;
  }
  
  .hero__description {
    margin: 0 auto 2rem;
  }
}
</style>