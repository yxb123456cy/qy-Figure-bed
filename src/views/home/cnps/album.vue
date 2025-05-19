<template>
    <div class="album">
        <div class="album__container">
        <div class="album__content">
            <div class="album__info">
            <h2 class="album__title">强大的相册功能</h2>
            <p class="album__description">
                支持创建多个相册，分类管理图片，提供时间轴视图，按时间顺序展示图片，支持添加图片描述和标签，提供相册分享功能，设置访问密码。
            </p>
            <ul class="album__features">
                <li class="album__feature">
                 <svg 
                    class="album__feature-icon" 
                    viewBox="0 0 24 24"
                    >
                    <path 
                    fill="#10b981" 
                    d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"
                    />
                </svg>
                <span class="album__feature-text">多相册分类管理</span>
                </li>
                <li class="album__feature">
                    <svg 
                    class="album__feature-icon" 
                    viewBox="0 0 24 24"
                    >
                    <path 
                    fill="#10b981" 
                    d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"
                    />
                </svg>
                <span class="album__feature-text">时间轴视图展示</span>
                </li>
                <li class="album__feature">
                    <svg 
                    class="album__feature-icon" 
                    viewBox="0 0 24 24"
                    >
                    <path 
                    fill="#10b981" 
                    d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"
                    />
                </svg>
                <span class="album__feature-text">图片描述和标签</span>
                </li>
                <li class="album__feature">
                    <svg 
                    class="album__feature-icon" 
                    viewBox="0 0 24 24"
                    >
                    <path 
                    fill="#10b981" 
                    d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"
                    />
                </svg>
                <span class="album__feature-text">密码保护分享</span>
                </li>
            </ul>
            </div>
            <div class="album__preview">
            <img
                src="https://readdy.ai/api/search-image?query=Modern%20photo%20album%20interface%20showing%20multiple%20image%20collections%20organized%20in%20a%20grid%20layout%20with%20timeline%20view%2C%20tags%20and%20sharing%20options%20visible%20in%20the%20UI%2C%20clean%20design%20with%20soft%20blue%20and%20purple%20gradient%20background.&width=600&height=400&seq=5&orientation=landscape"
                alt="相册功能展示"
                class="album__image"
            />
            </div>
        </div>
        </div>
    </div>
</template>
  
<script setup>

</script>
  
<style scoped>
.album {
  padding: 4rem 2rem;
  background: linear-gradient(to bottom right, #eff6ff, #f5f3ff);
}
.album__container {
  max-width: 80rem;
  margin: 0 auto;
}
.album__content {
  display: flex;
  align-items: center;
  gap: 3rem;
}
.album__info {
  flex: 1;
  padding-right: 3rem;
}
.album__title {
  font-size: 2rem;
  font-weight: bold;
  color: #1f2937;
  margin-bottom: 1.5rem;
}
.album__description {
  font-size: 1.125rem;
  color: #4b5563;
  margin-bottom: 2rem;
  line-height: 1.6;
}
.album__features {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.album__feature {
  display: flex;
  align-items: center;
}
.album__feature-icon {
  color: #10b981;
  margin-right: 0.75rem;
  width: 1.25rem;
}
.album__feature-text {
  color: #374151;
}
.album__preview {
  flex: 1;
}
.album__image {
  width: 100%;
  height: auto;
  border-radius: 0.5rem;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
}
</style>