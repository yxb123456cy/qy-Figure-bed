<template>
    <div class="social">
      <h2 class="social__title">社交互动功能</h2>
      <div class="social__grid">
        <div 
          v-for="(card, index) in cards" 
          :key="index" 
          class="social-card"
        >
          <div class="social-card__header">
            <div 
              :class="`social-card__icon-wrapper social-card__icon-wrapper--${card.color}`"
            >
              <svg 
                class="social-card__icon" 
                viewBox="0 0 24 24"
              >
                <path :fill="card.iconColor" :d="card.iconPath" />
              </svg>
            </div>
            <h3 class="social-card__title">{{ card.title }}</h3>
          </div>
          <p class="social-card__description">{{ card.description }}</p>
          <img 
            :src="card.imageSrc" 
            :alt="card.title" 
            class="social-card__image"
          />
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  const cards = [
    {
      color: 'pink',
      iconColor: '#db2777',
      iconPath: 'M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z',
      title: '评论与点赞',
      description: '与朋友和同事互动，对图片进行评论和点赞，分享您的想法和建议',
      imageSrc: 'https://qy-red-book.oss-cn-guangzhou.aliyuncs.com/i/2025/05/19/6hq5ho73.jpg'
    },
    {
      color: 'blue',
      iconColor: '#2563eb',
      iconPath: 'M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z',
      title: '收藏与推荐',
      description: '收藏您喜欢的图片，系统会根据您的兴趣智能推荐相关图片',
      imageSrc: 'https://qy-red-book.oss-cn-guangzhou.aliyuncs.com/i/2025/05/19/1n8fdmbn.jpg'
    }
  ]
  </script>


<style scoped>
.social {
  padding: 64px 32px;
  max-width: 1280px;
  margin: 0 auto;
}

.social__title {
  font-size: 32px;
  font-weight: bold;
  text-align: center;
  color: #1f2937;
  margin-bottom: 64px;
}

.social__grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 48px;
}

.social-card {
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  padding: 32px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.social-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}

.social-card__header {
  display: flex;
  align-items: center;
  margin-bottom: 24px;
}

.social-card__icon-wrapper {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16px;
}

.social-card__icon-wrapper--pink {
  background-color: #fce7f3;
}

.social-card__icon-wrapper--blue {
  background-color: #dbeafe;
}

.social-card__icon {
  width: 24px;
  height: 24px;
}

.social-card__title {
  font-size: 20px;
  font-weight: bold;
  color: #1f2937;
}

.social-card__description {
  color: #4b5563;
  margin-bottom: 24px;
  line-height: 1.5;
  font-size: 14px;
}

.social-card__image {
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 8px;
}

@media (max-width: 768px) {
  .social__grid {
    grid-template-columns: 1fr;
    gap: 32px;
  }
  
  .social {
    padding: 48px 16px;
  }
  
  .social__title {
    font-size: 28px;
    margin-bottom: 48px;
  }
  
  .social-card {
    padding: 24px;
  }
  
  .social-card__icon-wrapper {
    width: 40px;
    height: 40px;
  }
  
  .social-card__icon {
    width: 20px;
    height: 20px;
  }
  
  .social-card__title {
    font-size: 18px;
  }
  
  .social-card__description {
    font-size: 13px;
  }
  
  .social-card__image {
    height: 150px;
  }
}
</style>