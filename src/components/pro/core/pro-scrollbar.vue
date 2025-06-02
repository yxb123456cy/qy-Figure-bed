<!-- 
  ElScrollbar 二次封装（https://element-plus.org/zh-CN/component/scrollbar.html）
-->
<template>
    <el-scrollbar 
      v-bind="$attrs" 
      @scroll="handleScroll"
    >
      <slot />
    </el-scrollbar>
</template>

<script setup>
import { defineEmits, onUnmounted } from 'vue'
import { throttle, debounce } from 'lodash'

const emits = defineEmits([
    'scroll-position',  // 滚动位置事件
    'scroll-start',     // 开始滚动事件（配合节流）
    'scroll-end'        // 滚动结束事件（配合防抖）
])

const throttledScrollStart = throttle(() => {
    emits('scroll-start')
}, 100)

const debouncedScrollEnd = debounce(() => {
    emits('scroll-end')
}, 300)

const handleScroll = (scrollInfo) => {
    // 解构出滚动信息（来自Element Plus原生事件）<mcreference link="https://element-plus.org/zh-CN/component/scrollbar.html#scrollbar-%E6%BB%9A%E5%8A%A8%E6%9D%A1" index="0">0</mcreference>
    const { scrollTop, scrollLeft, clientWidth, clientHeight } = scrollInfo
    
    // 触发自定义滚动位置事件
    emits('scroll-position', {
        scrollTop,
        scrollLeft,
        clientWidth,
        clientHeight,
        isAtTop: scrollTop === 0,
        isAtBottom: scrollTop >= (scrollInfo.scrollHeight - clientHeight),
        isAtLeft: scrollLeft === 0,
        isAtRight: scrollLeft >= (scrollInfo.scrollWidth - clientWidth)
    })

    throttledScrollStart()
    debouncedScrollEnd()
}

onUnmounted(() => {
    throttledScrollStart.cancel()
    debouncedScrollEnd.cancel()
})
</script>