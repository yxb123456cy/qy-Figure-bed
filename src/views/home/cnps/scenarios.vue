<template>
    <div class="scenarios">
      <div class="scenarios__container">
        <h2 class="scenarios__title">应用场景</h2>
        <div class="scenarios__grid">
          <div 
            v-for="(scenario, index) in scenarios" 
            :key="index" 
            class="scenario-card"
          >
            <div class="scenario-card__decorative-svg">
              <svg viewBox="0 0 100 100" class="scenario-card__decorative">
                <circle cx="50" cy="50" r="40" :fill="scenario.iconColor" opacity="0.1"/>
                <path :fill="scenario.iconColor" opacity="0.2" d="M50,10 a40,40 0 1,0 0,80 a40,40 0 1,0 0,-80"/>
              </svg>
            </div>
            <div
              :class="`scenario-card__icon-wrapper scenario-card__icon-wrapper--${scenario.color}`"
            >
              <svg class="scenario-card__icon" viewBox="0 0 24 24">
                <path :fill="scenario.iconColor" :d="scenario.iconPath" />
              </svg>
            </div>
            <h3 class="scenario-card__title">{{ scenario.title }}</h3>
            <p class="scenario-card__description">{{ scenario.description }}</p>
            <div class="scenario-card__wave">
              <svg viewBox="0 0 500 50" preserveAspectRatio="none">
                <path d="M0,25 C150,50 350,0 500,25 L500,50 L0,50 Z" :fill="scenario.iconColor" opacity="0.1"></path>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
</template>
  
<script setup>
    const scenarios = [
        {
            color: 'blue',
            iconColor: '#2563eb',
            iconPath: 'M12 4a4 4 0 014 4c0 1.95-1.4 3.58-3.25 3.93V18h-1.5v-6.07C9.4 11.58 8 9.95 8 8a4 4 0 014-4z',
            title: '团队协作',
            description: '设计师、开发团队共享素材'
        },
        {
            color: 'purple',
            iconColor: '#7c3aed',
            iconPath: 'M20 2H4c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM8 20H4v-4h4v4zm0-6H4v-4h4v4zm0-6H4V4h4v4zm6 12h-4v-4h4v4zm0-6h-4v-4h4v4zm0-6h-4V4h4v4zm6 12h-4v-4h4v4zm0-6h-4v-4h4v4zm0-6h-4V4h4v4z',
            title: '个人博客',
            description: '方便插入图片'
        },
        {
            color: 'green',
            iconColor: '#059669',
            iconPath: 'M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z',
            title: '电商平台',
            description: '商品图片管理'
        },
        {
            color: 'pink',
            iconColor: '#db2777',
            iconPath: 'M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z',
            title: '家庭相册',
            description: '记录生活点滴'
        }
    ]
</script>

<style scoped>
.scenarios {
  padding: 64px 32px;
  background-color: rgba(255, 255, 255, 0.7);
}

.scenarios__container {
  max-width: 1280px;
  margin: 0 auto;
}

.scenarios__title {
  font-size: 32px;
  font-weight: bold;
  text-align: center;
  color: #1f2937;
  margin-bottom: 64px;
}

.scenarios__grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
}

.scenario-card {
  position: relative;
  overflow: hidden;
  text-align: center;
  padding: 16px;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.scenario-card__decorative-svg {
  position: absolute;
  top: -50px;
  right: -50px;
  width: 150px;
  height: 150px;
  opacity: 0.5;
}

.scenario-card__decorative {
  width: 100%;
  height: 100%;
}

.scenario-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}

.scenario-card__wave {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 30px;
}

.scenario-card__wave svg {
  width: 100%;
  height: 100%;
}

.scenario-card__icon-wrapper {
    position: relative;
    z-index: 1;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 16px;
  padding: 16px;
}

.scenario-card__icon {
  width: 100%;
  height: 100%;
  max-width: 48px;
  max-height: 48px;
}

.scenario-card__icon-wrapper--blue {
  background-color: #dbeafe;
}

.scenario-card__icon-wrapper--purple {
  background-color: #f3e8ff;
}

.scenario-card__icon-wrapper--green {
  background-color: #dcfce7;
}

.scenario-card__icon-wrapper--pink {
  background-color: #fce7f3;
}

.scenario-card__title {
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 8px;
}

.scenario-card__description {
  color: #4b5563;
  font-size: 14px;
  line-height: 1.5;
}

@media (max-width: 768px) {
  .scenarios__grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }
  
  .scenarios {
    padding: 48px 16px;
  }
  
  .scenarios__title {
    font-size: 28px;
    margin-bottom: 48px;
  }
  
  .scenario-card__icon-wrapper {
    width: 64px;
    height: 64px;
    padding: 12px;
  }

  .scenario-card__decorative-svg {
    top: -30px;
    right: -30px;
    width: 100px;
    height: 100px;
  }
  
  .scenario-card__wave {
    height: 20px;
  }
  
  .scenario-card__icon {
    max-width: 40px;
    max-height: 40px;
  }
  
  .scenario-card__title {
    font-size: 16px;
  }
  
  .scenario-card__description {
    font-size: 13px;
  }
}
</style>