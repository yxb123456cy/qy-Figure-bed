<template>
  <el-tooltip 
    :content="isDark ? '浅色模式' : '暗黑模式'" 
    placement="bottom"
    :effect="isDark? 'dark' : 'light'"
  >
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

<style scoped>

</style>