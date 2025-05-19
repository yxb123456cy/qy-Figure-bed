<template>
    <div class="advanced-features">
      <h2 class="advanced-features__title">高级功能</h2>
      <div class="advanced-features__grid">
        <div 
          v-for="(feature, index) in features" 
          :key="index" 
          class="feature"
        >
          <div 
            :class="`feature__icon-wrapper ${feature.iconWrapperClass}`"
          >
            <svg 
              class="feature__icon" 
              viewBox="0 0 24 24"
            >
              <path :fill="feature.iconColor" :d="feature.iconPath" />
            </svg>
          </div>
          <div class="feature__content">
            <h3 class="feature__title">{{ feature.title }}</h3>
            <p class="feature__description">{{ feature.description }}</p>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  const features = [
    {
      iconWrapperClass: '',
      iconColor: '#2563eb',
      iconPath: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z',
      title: '图片 AI 识别',
      description: '自动生成标签和描述，智能分类您的图片，提高检索效率'
    },
    {
      iconWrapperClass: 'feature__icon-wrapper--green',
      iconColor: '#059669',
      iconPath: 'M18 4V3c0-.55-.45-1-1-1H5c-.55 0-1 .45-1 1v4c0 .55.45 1 1 1h12c.55 0 1-.45 1-1V6h1v4H9v11c0 .55.45 1 1 1h2c.55 0 1-.45 1-1v-9h8V4h-3z',
      title: '图片压缩功能',
      description: '优化存储空间，提高加载速度，保持图片质量的同时减小文件大小'
    },
    {
      iconWrapperClass: 'feature__icon-wrapper--purple',
      iconColor: '#7c3aed',
      iconPath: 'M10.08 10.86c.05-.33.16-.62.3-.87s.34-.46.59-.62c.24-.15.54-.22.91-.23.23.01.44.05.63.13.2.09.38.21.52.36s.25.33.34.53.13.42.14.64h1.79c-.02-.47-.11-.9-.28-1.29s-.4-.73-.7-1.01-.66-.5-1.08-.66-.88-.23-1.39-.23c-.65 0-1.22.11-1.7.34s-.88.53-1.2.92-.56.84-.71 1.36S8 11.29 8 11.87v.27c0 .58.08 1.12.23 1.64s.39.97.71 1.35.72.69 1.2.91 1.05.34 1.7.34c.47 0 .91-.08 1.32-.23s.77-.36 1.08-.63.56-.58.74-.94.29-.74.3-1.15h-1.79c-.01.21-.06.4-.15.58s-.21.33-.36.46-.32.23-.52.3c-.19.08-.39.12-.6.13-.36-.01-.66-.08-.92-.23-.25-.15-.45-.36-.59-.62s-.25-.55-.3-.88-.08-.67-.08-1v-.27c0-.35.03-.68.08-1.01zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z',
      title: '图片水印功能',
      description: '保护版权，自定义水印内容和样式，防止图片被盗用'
    },
    {
      iconWrapperClass: 'feature__icon-wrapper--red',
      iconColor: '#dc2626',
      iconPath: 'M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM14 13v4h-4v-4H7l5-5 5 5h-3z',
      title: '图片备份和恢复',
      description: '自动备份您的图片资源，确保数据安全，支持一键恢复'
    }
  ]
  </script>
  
<style scoped>
.advanced-features {
  padding: 64px 32px;
  max-width: 1280px;
  margin: 0 auto;
}

.advanced-features__title {
  font-size: 32px;
  font-weight: bold;
  text-align: center;
  color: #1f2937;
  margin-bottom: 64px;
}

.advanced-features__grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 32px;
}

.feature {
  display: flex;
  align-items: flex-start;
  background-color: white;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.feature:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}

.feature__icon-wrapper {
  width: 48px;
  height: 48px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16px;
  flex-shrink: 0;
}

.feature__icon-wrapper--green {
  background-color: #d1fae5;
}

.feature__icon-wrapper--purple {
  background-color: #ede9fe;
}

.feature__icon-wrapper--red {
  background-color: #fee2e2;
}

.feature__icon {
  width: 24px;
  height: 24px;
}

.feature__content {
  flex: 1;
}

.feature__title {
  font-size: 20px;
  font-weight: bold;
  color: #1f2937;
  margin-bottom: 8px;
}

.feature__description {
  color: #4b5563;
  line-height: 1.5;
  font-size: 14px;
}

@media (max-width: 768px) {
  .advanced-features__grid {
    grid-template-columns: 1fr;
    gap: 24px;
  }
  
  .advanced-features {
    padding: 48px 16px;
  }
  
  .advanced-features__title {
    font-size: 28px;
    margin-bottom: 48px;
  }
  
  .feature {
    padding: 20px;
  }
  
  .feature__icon-wrapper {
    width: 40px;
    height: 40px;
  }
  
  .feature__icon {
    width: 20px;
    height: 20px;
  }
  
  .feature__title {
    font-size: 18px;
  }
  
  .feature__description {
    font-size: 13px;
  }
}
</style>