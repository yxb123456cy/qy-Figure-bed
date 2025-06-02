<template>
    <el-tooltip effect="dark" :content="isDark ? '切换明亮模式' : '切换暗黑模式'" placement="bottom">
      <el-icon :size="20" @click="toggleTheme" :class="{'dark-mode-btn': isDark}">
            <Moon v-if="isDark" />
            <Sunny v-else />
      </el-icon>
    </el-tooltip>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import { Moon, Sunny } from '@element-plus/icons-vue';
  
  const isDark = ref(false);
  const toggleTheme = () => {
    isDark.value = !isDark.value;
    document.documentElement.classList.toggle('dark', isDark.value);
  };
  </script>