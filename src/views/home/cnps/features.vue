<template>
    <div class="features">
      <h2 class="features__title">为什么选择我们的图片共享平台</h2>
      <div class="features__grid">
        <!-- 功能卡片 1 -->
        <div class="feature-card">
          <div class="feature-card__image-wrapper">
            <img
              src="https://qy-red-book.oss-cn-guangzhou.aliyuncs.com/i/2025/05/19/f72h4b8c.jpg"
              alt="团队协作"
              class="w-full h-full object-cover"
            />
          </div>
          <div class="feature-card__content">
            <h3 class="feature-card__title">团队图片资源共享</h3>
            <p class="feature-card__description">
              支持多用户协作，团队成员可以上传、管理和共享图片资源，提供权限管理功能，可以设置不同用户对图片的访问权限。
            </p>
          </div>
        </div>
        <!-- 功能卡片 2 -->
        <div class="feature-card">
          <div class="feature-card__image-wrapper">
            <img
              src="https://qy-red-book.oss-cn-guangzhou.aliyuncs.com/i/2025/05/19/who3bp9s.jpg"
              alt="多终端访问"
              class="w-full h-full object-cover"
            />
          </div>
          <div class="feature-card__content">
            <h3 class="feature-card__title">
              个人图片随时随地预览
            </h3>
            <p class="feature-card__description">
              支持多终端访问（PC、手机、平板），提供图片缩略图预览，支持快速加载，随时随地访问您的图片资源。
            </p>
          </div>
        </div>
        <!-- 功能卡片 3 -->
        <div class="feature-card">
          <div class="feature-card__image-wrapper">
            <img
              src="https://qy-red-book.oss-cn-guangzhou.aliyuncs.com/i/2025/05/19/jq6hwfsj.jpg"
              alt="全网共享"
              class="w-full h-full object-cover"
            />
          </div>
          <div class="feature-card__content">
            <h3 class="feature-card__title">
              发布图床全网共享
            </h3>
            <p class="feature-card__description">
              支持创建公开图床，设置访问权限，提供API接口，方便其他开发者调用，支持图片防盗链功能。
            </p>
          </div>
        </div>
      </div>
    </div>
</template>

<script setup>
</script>

<style scoped>
.features {
  padding: 64px 32px;
  max-width: 1280px;
  margin: 0 auto;
}

.features__title {
  font-size: 32px;
  font-weight: bold;
  text-align: center;
  color: #1f2937;
  margin-bottom: 64px;
}

.features__grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 32px;
}

.feature-card {
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: box-shadow 0.3s ease;
}

.feature-card:hover {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}

.feature-card__image-wrapper {
  height: 192px;
  overflow: hidden;
}

.feature-card__image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.feature-card__content {
  padding: 24px;
}

.feature-card__title {
  font-size: 20px;
  font-weight: bold;
  color: #1f2937;
  margin-bottom: 12px;
}

.feature-card__description {
  color: #4b5563;
  line-height: 1.5;
}

@media (max-width: 768px) {
  .features__grid {
    grid-template-columns: 1fr;
    gap: 24px;
  }
  
  .features {
    padding: 48px 16px;
  }
  
  .features__title {
    font-size: 28px;
    margin-bottom: 48px;
  }
  
  .feature-card__image-wrapper {
    height: 160px;
  }
  
  .feature-card__content {
    padding: 20px;
  }
  
  .feature-card__title {
    font-size: 18px;
  }
}
</style>