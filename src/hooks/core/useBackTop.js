import { ref, onMounted, onUnmounted } from 'vue'

/**
 * 回到顶部功能 hooks
 * @returns {Object} 包含滚动百分比和滚动到顶部的方法
 */
export const useBackTop = () => {
  const scrollPercentage = ref(0)

  // 计算滚动百分比
  const calculateScrollPercentage = () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop
    const windowHeight = window.innerHeight
    const documentHeight = Math.max(
      document.body.scrollHeight,
      document.documentElement.scrollHeight,
      document.body.offsetHeight,
      document.documentElement.offsetHeight,
      document.body.clientHeight,
      document.documentElement.clientHeight
    )
    
    const scrollableHeight = documentHeight - windowHeight;
    const percentage = scrollableHeight > 0 
      ? Math.min(Math.round((scrollTop / scrollableHeight) * 100), 100) 
      : 0
    
    scrollPercentage.value = percentage
  }

  // 滚动到顶部
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  // 挂载滚动监听
  const handleScroll = () => {
    calculateScrollPercentage()
  }

  onMounted(() => {
    window.addEventListener('scroll', handleScroll)
    // 初始加载时滚动到顶部
    // scrollToTop()
  })

  onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll)
  })

  return {
    scrollPercentage,
    scrollToTop
  }
}
